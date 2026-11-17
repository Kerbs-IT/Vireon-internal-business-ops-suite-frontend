import type { Workbook, Worksheet } from "exceljs";

const C = {
  headerBg: "FF1E293B",
  headerText: "FFFFFFFF",
  sectionBg: "FFE2E8F0",
  border: "FFCBD5E1",
  good: "FF1D4ED8",
  bad: "FFEA580C",
  watch: "FFD97706",
  muted: "FF64748B",
};

type Cell = string | number | Date | null | undefined;

const toDate = (s?: string | null) =>
  s ? new Date(`${s.slice(0, 10)}T00:00:00`) : null;
const ratio = (done: number, total: number) => (total > 0 ? done / total : 0);

const thin = { style: "thin" as const, color: { argb: C.border } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

function title(ws: Worksheet, text: string, subtitle?: string) {
  ws.getCell("A1").value = text;
  ws.getCell("A1").font = { bold: true, size: 16 };
  if (subtitle) {
    ws.getCell("A2").value = subtitle;
    ws.getCell("A2").font = { size: 10, color: { argb: C.muted }, italic: true };
  }
}

const fullName = (
  p?: { first_name?: string | null; last_name?: string | null } | null,
) => (p ? [p.first_name, p.last_name].filter(Boolean).join(" ") : "");

function headerRow(ws: Worksheet, rowNo: number, headers: string[]) {
  const row = ws.getRow(rowNo);
  headers.forEach((h, i) => (row.getCell(i + 1).value = h));
  row.height = 22;
  row.eachCell((c) => {
    c.font = { bold: true, color: { argb: C.headerText } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.headerBg } };
    c.alignment = { vertical: "middle", horizontal: "left" };
    c.border = box;
  });
}

function dataRows(
  ws: Worksheet,
  startRow: number,
  rows: Cell[][],
  formats: Record<number, string> = {}, // zero-based column index -> numFmt
) {
  if (!rows.length) {
    ws.getCell(startRow, 1).value = "No data for the selected filters";
    ws.getCell(startRow, 1).font = { italic: true, color: { argb: C.muted } };
    return startRow + 1;
  }
  rows.forEach((r, i) => {
    const row = ws.getRow(startRow + i);
    r.forEach((v, j) => {
      const c = row.getCell(j + 1);
      c.value = v ?? "";
      c.border = box;
      c.alignment = {
        vertical: "middle",
        horizontal: typeof v === "number" || v instanceof Date ? "right" : "left",
      };
      if (formats[j]) c.numFmt = formats[j];
    });
  });
  return startRow + rows.length;
}

/** One table per sheet: title, header, frozen header, filters, sized columns. */
function tableSheet(
  wb: Workbook,
  name: string,
  heading: string,
  note: string,
  headers: string[],
  rows: Cell[][],
  widths: number[],
  formats: Record<number, string> = {},
) {
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 4 }] });
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
  title(ws, heading, note);
  headerRow(ws, 4, headers);
  dataRows(ws, 5, rows, formats);
  if (rows.length) {
    ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: headers.length } };
  }
  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  return ws;
}

export interface ReportExportInput {
  filterLabels: { period: string; project: string; department: string };
  periodRange: string;
  metricCards?: {
    taskCompleted: number;
    overdueTasks: number;
    pendingLeaveRequest: number;
    leaveDaysTaken: number;
  };
  summaryMetrics: any[];
  statusCounts?: { todo: number; in_progress: number; review: number; done: number };
  projects: any[];
  employees: any[];
  leaveByMonth: any[];
  needAttention: any[];
  leaveThisWeek: any[];
}

export async function exportReportXlsx(d: ReportExportInput) {
  const { Workbook } = await import("exceljs"); // loaded only when exporting
  const wb = new Workbook();
  wb.created = new Date();

  const filterNote = `${d.filterLabels.period} (${d.periodRange})  |  ${d.filterLabels.project}  |  ${d.filterLabels.department}`;

  /* ---------------- Sheet 1: Summary ---------------- */
  const ws = wb.addWorksheet("Summary");
  [32, 16, 16, 20].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  title(ws, "Reports overview");

  const meta: [string, string][] = [
    ["Generated", new Date().toLocaleString("en-GB")],
    ["Period", `${d.filterLabels.period} (${d.periodRange})`],
    ["Project", d.filterLabels.project],
    ["Department", d.filterLabels.department],
  ];
  meta.forEach(([k, v], i) => {
    ws.getCell(3 + i, 1).value = k;
    ws.getCell(3 + i, 1).font = { bold: true };
    ws.getCell(3 + i, 2).value = v;
  });

  const sectionTitle = (row: number, text: string) => {
    const r = ws.getRow(row);
    for (let c = 1; c <= 4; c++) r.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.sectionBg } };
    r.getCell(1).value = text;
    r.getCell(1).font = { bold: true, size: 12 };
  };

  // Key metrics
  let r = 9;
  sectionTitle(r, "Key metrics");
  headerRow(ws, r + 1, ["Metric", "Value"]);
  const m = d.metricCards;
  r = dataRows(ws, r + 2, m ? [
    ["Tasks completed", m.taskCompleted],
    ["Overdue tasks (as of today)", m.overdueTasks],
    ["Leave awaiting approval (as of today)", m.pendingLeaveRequest],
    ["Leave days taken", m.leaveDaysTaken],
  ] : []);

  // Summary metrics vs previous period: numeric change + plain-language verdict
  r += 2;
  sectionTitle(r, "Performance vs previous period");
  headerRow(ws, r + 1, ["Metric", "Current", "Change", "Assessment"]);
  const first = r + 2;
  const rows: Cell[][] = d.summaryMetrics.map((x) => {
    const c = x.change;
    const signed = c ? (c.direction === "up" ? c.amount : -c.amount) : null;
    const verdict = !c ? "No change / no baseline"
      : c.tone === "good" ? "Improved"
      : c.tone === "bad" ? "Worsened"
      : "Watch";
    return [x.label, x.value, signed, verdict];
  });
  r = dataRows(ws, first, rows);
  d.summaryMetrics.forEach((x, i) => {
    const row = ws.getRow(first + i);
    const unit = x.change?.unit === "%" ? '"%"' : "";
    row.getCell(3).numFmt = `+0${unit};-0${unit};0${unit}`;
    const color = { good: C.good, bad: C.bad, watch: C.watch }[x.change?.tone as "good"];
    if (color) row.getCell(4).font = { bold: true, color: { argb: color } };
  });

  // Tasks by status
  r += 2;
  sectionTitle(r, "Tasks by status");
  headerRow(ws, r + 1, ["Status", "Tasks", "Share"]);
  const s = d.statusCounts;
  const total = s ? s.todo + s.in_progress + s.review + s.done : 0;
  r = dataRows(ws, r + 2, s ? [
    ["To do", s.todo, ratio(s.todo, total)],
    ["In progress", s.in_progress, ratio(s.in_progress, total)],
    ["Review", s.review, ratio(s.review, total)],
    ["Done", s.done, ratio(s.done, total)],
    ["Total", total, total ? 1 : 0],
  ] : [], { 2: "0%" });
  if (s) ws.getRow(r - 1).font = { bold: true };

  ws.pageSetup = { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  /* ---------------- Detail sheets ---------------- */
  tableSheet(wb, "Projects", "Task completion by project", filterNote,
    ["Project", "Total tasks", "Completed", "Completion rate"],
    d.projects.map((p) => [p.name, p.total_tasks, p.completed_tasks_count,
      ratio(p.completed_tasks_count, p.total_tasks)]),
    [36, 14, 14, 18], { 3: "0%" });

  tableSheet(wb, "Workload", "Workload by employee", filterNote,
    ["Employee", "Total tasks", "Completed", "Overdue", "Completion rate"],
   d.employees.map((e) => [fullName(e), e.total_tasks_count, e.completed_tasks_count,
  e.overdue_tasks_count, ratio(e.completed_tasks_count, e.total_tasks_count)]),
    [30, 14, 14, 14, 18], { 4: "0%" });

  tableSheet(wb, "Needs attention", "Overdue tasks needing attention", filterNote,
    ["Task", "Project", "Assignee", "Due date"],
    d.needAttention.map((t) => [t.title, t.project?.name, fullName(t.assignee), toDate(t.due_date)]),
    [40, 28, 24, 16], { 3: "dd mmm yyyy" });

  tableSheet(wb, "Leave by month", "Leave requests by month",
    `Calendar year view, not affected by the period filter  |  ${d.filterLabels.department}`,
    ["Month", "Approved", "Pending", "Rejected", "Total"],
    d.leaveByMonth.map((l) => [l.month, l.approved, l.pending, l.rejected,
      l.approved + l.pending + l.rejected]),
    [14, 14, 14, 14, 14]);

  tableSheet(wb, "Out this week", "Employees on leave this week",
    `Current week only, not affected by the period filter  |  ${d.filterLabels.department}`,
    ["Employee", "Leave type", "Start date", "End date"],
   d.leaveThisWeek.map((l) => [fullName(l.user), l.leave_type?.name,
  toDate(l.start_date), toDate(l.end_date)]),
    [30, 22, 16, 16], { 2: "dd mmm yyyy", 3: "dd mmm yyyy" });

  /* ---------------- Download ---------------- */
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const slug = d.filterLabels.period.replace(/\s+/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `Report_${new Date().toISOString().slice(0, 10)}_${slug}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
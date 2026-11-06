import { format} from "date-fns";

export function formatDate(date:string) {
    
    return format(date, 'MMM dd yyyy');
}
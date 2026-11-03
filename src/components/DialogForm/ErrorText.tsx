export default function ErrorText({message}:{message:string}) {
   if (!message) return null;
   return (
     <p className="text-sm font-medium text-destructive mt-1">{message}</p>
   );
}
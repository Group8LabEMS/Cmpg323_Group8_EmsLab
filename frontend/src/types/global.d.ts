interface Window {
  currentUser?: { userId: number; };
  currentRole?: string;
  addToast?: (title: string, desc: string, duration?: number) => void;
}
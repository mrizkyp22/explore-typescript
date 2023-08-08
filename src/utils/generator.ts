export const generateUserId = (): string => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(currentDate.getFullYear());
    const randomDigits = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
    return `userid${day}${month}${year}${randomDigits}`;
  }
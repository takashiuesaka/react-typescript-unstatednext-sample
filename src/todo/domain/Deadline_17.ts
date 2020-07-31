export class Deadline {
    rawDateString: string;
    private rawDate: Date;
    constructor(rawDateString: string) {
      if (!rawDateString) throw new Error("rawDateStringが未定義です。");
      this.rawDateString = rawDateString;
  
      if (!this.isValid()) {
        console.error(`rawDateString の書式が不正です。rawDateString=${rawDateString}`);
        throw new Error(`rawDateString の書式が不正です。rawDateString=${rawDateString}`);
      }
  
      this.rawDate = new Date(`${this.rawDateString} 00:00:00`);
    }
  
    today() {
      return new Date(new Date().toLocaleDateString());
    }
  
    isToday() {
      if (this.today().getTime() === this.rawDate.getTime()) {
        return true;
      }
  
      return false;
    }
  
    isPast() {
      if (this.today().getTime() > this.rawDate.getTime()) {
        return true;
      }
  
      return false;
    }
  
    isValid() {
      const a = this.rawDateString.match(/^(\d+)-(\d+)-(\d+)$/);
      if (a) {
        const y = parseInt(a[1]);
        const m = parseInt(a[2]) - 1;
        const d = parseInt(a[3]);
        const x = new Date(y, m, d);
        return (y === x.getFullYear() && m === x.getMonth() && d === x.getDate());
      }
  
      return false;
    }
  }
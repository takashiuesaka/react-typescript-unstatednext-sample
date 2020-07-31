export class Todo {

  task: string = "";
  deadline: string = "";

  constructor(task: string, deadline: string) {

    if (!task) throw new Error("task が未定義です。");
    this.task = task;

    if (!deadline) throw new Error("deadline が未定義です。");
    this.deadlineString = deadline;

    if (!this.isDeadlineValid()) {
      console.error(`deadline の書式が不正です。rawDateString=${deadline}`);
      throw new Error(`deadline の書式が不正です。rawDateString=${deadline}`);
    }

    // this.deadlineDate = new Date(`${this.deadlineString} 00:00:00`);
  }

  copy() {
    return new Todo(this.task, this.deadline);
  }

  private getDeadlineDate() {
    return new Date(`${this.deadline} 00:00:00`);
  }

  private today() {
    return new Date(new Date().toLocaleDateString());
  }

  isToday() {
    if (!this.isDeadlineValid()) return false;

    if (this.today().getTime() === this.getDeadlineDate()?.getTime()) {
      return true;
    }

    return false;
  }

  isPast() {
    if (!this.isDeadlineValid()) return false;

    if (this.today().getTime() > this.getDeadlineDate().getTime()) {
      return true;
    }

    return false;
  }

  isValid() {
    const validator = this.validator();
    return validator.next().done;
  }

  isDeadlineValid() {
    const a = this.deadline.match(/^(\d+)-(\d+)-(\d+)$/);
    if (a) {
      const y = parseInt(a[1]);
      const m = parseInt(a[2]) - 1;
      const d = parseInt(a[3]);
      const x = new Date(y, m, d);
      return { taskError: (y === x.getFullYear() && m === x.getMonth() && d === x.getDate()) };
    }

    return false;
  }

  * validator() {
    const a = this.deadline.match(/^(\d+)-(\d+)-(\d+)$/);
    if (a) {
      const y = parseInt(a[1]);
      const m = parseInt(a[2]) - 1;
      const d = parseInt(a[3]);
      const x = new Date(y, m, d);
      yield { taskError: (y === x.getFullYear() && m === x.getMonth() && d === x.getDate()) };
    }
  }

  Errors() {

  }
}
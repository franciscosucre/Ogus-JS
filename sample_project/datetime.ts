import dayjs from 'dayjs';

export class Datetime {
	private _date: dayjs.Dayjs;

	constructor(date: dayjs.Dayjs = dayjs()) {
		this._date = date;
	}

	static now(): Datetime {
		return new Datetime();
	}

	static create(input: Date | number | string, options: { format?: string } = {}): Datetime {
		const { format } = options;
		if (typeof input === 'string' && format) {
			return new Datetime(dayjs(input, format));
		}
		return new Datetime(dayjs(input));
	}

	static fromUnix(input: number): Datetime {
		return Datetime.create(dayjs.unix(input).toDate());
	}

	add(value: number, timeUnit: TimeUnit) {
		return new Datetime(dayjs(this._date).add(value, timeUnit));
	}

	subtract(value: number, timeUnit: TimeUnit) {
		return new Datetime(dayjs(this._date).subtract(value, timeUnit));
	}

	difference(a: Datetime, b: Datetime, timeUnit: TimeUnit): number {
		return dayjs(a._date).diff(b._date, timeUnit);
	}

	format(formatString: string): string {
		return this._date.format(formatString);
	}

	get(timeUnit: TimeUnit) {
		return this._date.get(timeUnit);
	}

	with(value: number, timeUnit: TimeUnit): Datetime {
		return new Datetime(dayjs(this._date).set(timeUnit, value));
	}

	toDate() {
		return this._date.toDate();
	}

	toUnix() {
		return this._date.unix();
	}

	toString() {
		return this._date.toDate().toString();
	}

	valueOf() {
		return this._date.toDate().valueOf();
	}
}

export enum TimeUnit {
	MILLISECOND = 'millisecond',
	SECOND = 'second',
	MINUTE = 'minute',
	HOUR = 'hour',
	DAY = 'day',
	MONTH = 'month',
	YEAR = 'year',
	DATE = 'date',
}

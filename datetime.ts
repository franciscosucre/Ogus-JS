import * as denoDatetime from "deno/datetime/mod.ts";
import * as dateFns from "date-fns"



export class Datetime {
    private _date: Date

    constructor(date: Date=new Date()){
        this._date = date
    }

    static now(): Datetime{
        return new Datetime()
    }

    static create(input: Date | number | string, options: {format?: string} = {}): Datetime{
        const {format} = options
        if (typeof input === 'string' && format){
            return new Datetime(denoDatetime.parse(input, format))
        }
        return new Datetime(new Date(input))
    }

    static fromUnix(input: number): Datetime{
        return Datetime.create(dateFns.fromUnixTime(input))
    }

    add(value: number, timeUnit: TimeUnit){
        return new Datetime(dateFns.add(this._date, {
            [timeUnit]: value
        }))
    }

    subtract(value: number, timeUnit: TimeUnit){
        return new Datetime(dateFns.sub(this._date, {
            [timeUnit]: value
        }))
    }

    difference(a: Datetime, b: Datetime, timeunit: TimeUnit): number{
        return denoDatetime.difference(a._date, b._date, {
            units: [timeunit]
        })[timeunit] as number
    }

    format(formatString: string): string{
        return denoDatetime.format(this._date, formatString)
    }


    with(value: number, timeUnit: TimeUnit): Datetime{
        return new Datetime(dateFns.set(this._date, {[timeUnit]: value}) )
    }

    toDate(){
        return new Date(this._date)
    }

    toUnix(){
        return dateFns.getUnixTime(this._date)
    }

    toString(){
        return this._date.toString()
    }

    valueOf(){
        return this._date.valueOf()
    }
}

export enum TimeUnit  {
    MILLISECONDS= 'milliseconds',
    SECOND= 'seconds',
    MINUTE= 'minutes',
    HOUR= 'hours',
    DAY= 'days',
    WEEK= 'weeks',
    MONTH= 'months',
    QUARTER= 'quarters',
    YEAR= 'years',
}

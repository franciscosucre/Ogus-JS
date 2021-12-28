export type Convertor = {
  isValidValue(valueString: string): boolean;
  convert(valueString: string): any;
};

export type Primitives = string | number | boolean | Date;

export class QueryParamsParser {
    private convertors: Convertor[]

    static defaultConvertors: Convertor[] = [
    {
      isValidValue: (value: string) => ["true", "false"].includes(value),
      convert: (value) => new Boolean(value),
    },
    {
      isValidValue: (value: string) => !isNaN(Number(value)),
      convert: (value) => new Number(value),
    },
    {
      isValidValue: (value: string) => !isNaN(new Date(value).getTime()),
      convert: (value) => new Date(value),
    },
  ]


  constructor(convertors: Convertor[]){
    this.convertors = convertors
  }

  parse(url: URL) {
    const parsedQueryParams: Record<string, Primitives | Primitives[]> = {};
    for (const queryParamTuple of url.searchParams) {
      const [key, value] = queryParamTuple;
      if (parsedQueryParams[key]) {
        const oldValue = parsedQueryParams[key];
        if (Array.isArray(oldValue)) {
          oldValue.push(this.convertValue(value));
        } else {
          parsedQueryParams[key] = [oldValue, this.convertValue(value)];
        }
      } else {
        parsedQueryParams[key] = this.convertValue(value);
      }
    }
    return parsedQueryParams
  }

  convertValue(value: string) {
    for (const convertor of this.convertors) {
      if (convertor.isValidValue(value)) {
        return convertor.convert(value);
      }
    }
    return value
  }
}

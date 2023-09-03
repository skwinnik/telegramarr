export class RadarrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RadarrError';
  }
}
export class RadarrBadRequestError extends RadarrError {
  constructor(message: string) {
    super(message);
  }
}

export class RadarrValidationError extends RadarrBadRequestError {
  private readonly fields: {
    propertyName: string;
    errorMessage: string;
  }[];
  constructor(message: string, fields: unknown[]) {
    super(message);
    this.fields = [];
    for (const field of fields) {
      if (field == null) continue;
      if (typeof field !== 'object') continue;
      if (!('propertyName' in field)) continue;
      if (!('errorMessage' in field)) continue;

      this.fields.push({
        propertyName: field['propertyName'] as string,
        errorMessage: field['errorMessage'] as string,
      });
    }
  }
}

export class RadarrErrorFactory {
  static async fromResponse(response: Response): Promise<RadarrError> {
    if (response.status === 400) {
      return RadarrErrorFactory.badRequest(response);
    }

    return new RadarrError(response.statusText);
  }

  static async badRequest(response: Response): Promise<RadarrBadRequestError> {
    const body = await response.json();
    if (body instanceof Array) {
      return new RadarrValidationError('Request validation failed', body);
    }

    return new RadarrBadRequestError(response.statusText);
  }
}

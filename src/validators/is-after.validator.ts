import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  private errorType: 'equal' | 'before' | 'invalid-date' | null = null;

  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    const valueDate = new Date(value);
    const relatedDate = new Date(relatedValue);

    if (isNaN(valueDate.getTime()) || isNaN(relatedDate.getTime())) {
      this.errorType = 'invalid-date';
      return false;
    }

    if (valueDate.getTime() === relatedDate.getTime()) {
      this.errorType = 'equal';
      return false;
    }

    if (valueDate.getTime() < relatedDate.getTime()) {
      this.errorType = 'before';
      return false;
    }

    this.errorType = null;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;

    switch (this.errorType) {
      case 'equal':
        return `${args.property} cannot be the same as ${relatedPropertyName}`;
      case 'before':
        return `${args.property} must be after ${relatedPropertyName}`;
      default:
        return `${args.property} must be after ${relatedPropertyName}`;
    }
  }
}

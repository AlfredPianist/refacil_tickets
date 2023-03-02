import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function CheckNumberOfSeats(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "checkNumberOfSeats",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Array.isArray(value) && value.length >= 1 && value.length <= 4;
        },
      },
    });
  };
}

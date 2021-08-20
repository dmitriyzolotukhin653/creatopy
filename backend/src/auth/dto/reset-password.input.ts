import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  username: string;

  @Field()
  newPassword: string;
}

import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CheckUsernameArgs {
  @Field()
  username: string;
}

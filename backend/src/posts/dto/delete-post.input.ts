import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePostInput {
  @Field(() => ID)
  id!: number;
}

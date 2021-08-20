import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { DeletePostInput } from './dto/delete-post.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post], { name: 'posts' })
  getPosts(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(
    @CurrentUser() user: User,
    @Args('input') { title }: CreatePostInput,
  ): Promise<Post> {
    console.log('current user', user);
    return this.postsService.create(title, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(@Args('input') { id, title }: UpdatePostInput) {
    return this.postsService.update(id, title);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args('input') { id }: DeletePostInput): Promise<boolean> {
    await this.postsService.delete(id);
    return true;
  }
}

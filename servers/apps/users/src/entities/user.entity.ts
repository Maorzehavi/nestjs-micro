import { Directive, Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Directive('@key(fields: "id")')

export class Avatar {

    @Field()
    id: string;
    @Field()
    public_id: string;

    @Field()
    url: string;

    @Field()
    user_id: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class User {

    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    avatar?: Avatar | null;

    @Field()
    role: string;

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}




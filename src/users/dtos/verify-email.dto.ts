import { Verification } from './../entities/verification.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class VerifyEmailOutput extends CoreOutput { }

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) { }
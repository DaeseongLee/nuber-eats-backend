import { PubSub } from 'graphql-subscriptions';
import { Module, Global } from '@nestjs/common';
import { PUB_SUB } from './common.constant';

const pubsub = new PubSub();

@Global()
@Module({
    providers: [
        {
            provide: PUB_SUB,
            useValue: pubsub,
        }
    ],
    exports: [PUB_SUB],
},
)
export class CommonModule { }

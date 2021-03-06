import { CommonModule } from './common/common.module';
import { OrderItem } from './order/entities/order-item.entity';
import { Dish } from './restraurants/entities/dish.entity';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restraurants/restraunt.module';
import { Category } from './restraurants/entities/category.entity';
import { Restaurant } from './restraurants/entities/restaurant.entity';
import { Verification } from './users/entities/verification.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production', //배포할때는 환경변수파일 무시하겠다.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'production', 'test')
          .required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
        AWS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
      })

    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
      synchronize: process.env.NODE_ENV !== 'prod',
      // ssl: { rejectUnauthorized: false },
      logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Verification, Restaurant, Category, Dish, Order, OrderItem, Payment],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';

        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        }
      },
    }),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrderModule,
    CommonModule,
    PaymentsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
//   implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(jwtMiddleware).forRoutes({
//       path: '/graphql',
//       method: RequestMethod.POST
//     })
//   }
// }

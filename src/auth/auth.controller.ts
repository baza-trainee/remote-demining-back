import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { SignupDto } from './dto/signup';
import { JwtAuthGuard } from './guards/JwtGuard';
import { PassworGroupDto } from './dto/password-group';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUserRes } from './dto/auth-user-res';
import { forgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordParams } from './dto/reset-password';
import { UserSafe } from 'src/user/entities/user-safe.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User created', type: AuthUserRes })
  @ApiConflictResponse({ description: 'User wit email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  signup(@Body() createdUser: SignupDto): Promise<AuthUserRes> {
    return this.authService.signup(createdUser);
  }
  @Post('login')
  @ApiResponse({ status: 200, description: 'All good', type: AuthUserRes })
  @ApiConflictResponse({ description: 'User data is unvalid' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  async login(@Body() createdUser: LoginDto): Promise<AuthUserRes> {
    return await this.authService.login(createdUser);
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  @ApiResponse({ status: 200, description: 'Email with link sended' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @HttpCode(200)
  forgotPassword(@Body() forgotPassword: forgotPasswordDto) {
    console.log(forgotPassword);
    return this.authService.forgotPassword(forgotPassword.email);
  }

  @Post('forgot-password/:id/:token')
  @ApiOperation({
    summary: 'Reset forgot password',
    description:
      'This endpoint is created for the user goes to the link received in the mail. The link will send it to your client along the path CLIENT_URL/forgot-password/:id/:token and only in this way you will receive a valid id and token',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: AuthUserRes,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  resetPassword(
    @Param() params: ResetPasswordParams,
    @Body() resetPassword: PassworGroupDto,
  ) {
    return this.authService.resetPassword(
      params.id,
      params.token,
      resetPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: UserSafe,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  changePassword(
    @Headers() headers,
    @Body()
    changePassword: PassworGroupDto,
  ) {
    const jwt = headers.authorization.split(' ')[1];
    return this.authService.changePassword(jwt, changePassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth-ping')
  test() {
    return true;
  }
  @Get('ping')
  ping() {
    return true;
  }
}

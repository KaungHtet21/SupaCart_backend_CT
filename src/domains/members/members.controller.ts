import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { 
  CreateMembershipPackageDto, 
  UpdateMembershipPackageDto,
  CreateMembershipDto,
  UpdateMembershipStatusDto,
  CheckInDto,
  MembershipPackageResponseDto,
  MembershipResponseDto,
  CheckInResponseDto
} from './dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { QrDecisionInput } from './inputs';

@ApiTags('members')
@Controller('members')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private membersService: MembersService) {}

  // Membership Package endpoints
  @Post('packages')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new membership package (Admin only)' })
  @ApiResponse({ status: 201, description: 'Membership package created successfully', type: MembershipPackageResponseDto })
  async createMembershipPackage(@Body() createPackageDto: CreateMembershipPackageDto) {
    return this.membersService.createMembershipPackage(createPackageDto);
  }

  @Put('packages/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a membership package (Admin only)' })
  @ApiResponse({ status: 200, description: 'Membership package updated successfully', type: MembershipPackageResponseDto })
  async updateMembershipPackage(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdateMembershipPackageDto,
  ) {
    return this.membersService.updateMembershipPackage(id, updatePackageDto);
  }

  @Delete('packages/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a membership package (Admin only)' })
  @ApiResponse({ status: 200, description: 'Membership package deleted successfully' })
  async deleteMembershipPackage(@Param('id') id: string) {
    return this.membersService.deleteMembershipPackage(id);
  }

  @Get('packages')
  @ApiOperation({ summary: 'Get all active membership packages' })
  @ApiResponse({ status: 200, description: 'Membership packages retrieved successfully', type: [MembershipPackageResponseDto] })
  async getAllMembershipPackages() {
    return this.membersService.getAllMembershipPackages();
  }

  @Get('packages/:id')
  @ApiOperation({ summary: 'Get a membership package by ID' })
  @ApiResponse({ status: 200, description: 'Membership package retrieved successfully', type: MembershipPackageResponseDto })
  async getMembershipPackageById(@Param('id') id: string) {
    return this.membersService.getMembershipPackageById(id);
  }

  // Membership endpoints
  @Post('memberships')
  @UseInterceptors(FileInterceptor('paymentScreenshot'))
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Membership created successfully', type: MembershipResponseDto })
  async createMembership(
    @Request() req, 
    @Body() createMembershipDto: CreateMembershipDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.membersService.createMembership(req.user.sub, createMembershipDto, file);
  }

  @Put('memberships/:id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update membership status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Membership status updated successfully', type: MembershipResponseDto })
  async updateMembershipStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateMembershipStatusDto,
  ) {
    return this.membersService.updateMembershipStatus(id, updateStatusDto);
  }

  @Get('memberships/my')
  @ApiOperation({ summary: 'Get current user memberships' })
  @ApiResponse({ status: 200, description: 'User memberships retrieved successfully', type: [MembershipResponseDto] })
  async getUserMemberships(@Request() req) {
    return this.membersService.getUserMemberships(req.user.sub);
  }

  @Get('memberships')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all memberships (Admin only)' })
  @ApiResponse({ status: 200, description: 'All memberships retrieved successfully', type: [MembershipResponseDto] })
  async getAllMemberships() {
    return this.membersService.getAllMemberships();
  }

  @Get('memberships/:id')
  @ApiOperation({ summary: 'Get a membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership retrieved successfully', type: MembershipResponseDto })
  async getMembershipById(@Param('id') id: string) {
    return this.membersService.getMembershipById(id);
  }

  // Check-in endpoints
  @Post('checkin')
  @ApiOperation({ summary: 'Check in to the gym' })
  @ApiResponse({ status: 201, description: 'Check-in successful', type: CheckInResponseDto })
  async checkIn(@Body() checkInDto: CheckInDto) {
    return this.membersService.checkIn(checkInDto);
  }

  @Get('checkin')
  @ApiOperation({ summary: 'Get check-in history' })
  @ApiResponse({ status: 200, description: 'Check-in history retrieved successfully', type: [CheckInResponseDto] })
  async getCheckIns(@Query('userId') userId?: string) {
    return this.membersService.getCheckIns(userId);
  }

  @Get('checkin/:id')
  @ApiOperation({ summary: 'Get a check-in record by ID' })
  @ApiResponse({ status: 200, description: 'Check-in record retrieved successfully', type: CheckInResponseDto })
  async getCheckInById(@Param('id') id: string) {
    return this.membersService.getCheckInById(id);
  }

  // QR Check-in endpoints
  @Post('checkin/qr/initiate')
  @ApiOperation({ summary: 'Initiate QR check-in session (member)' })
  @ApiResponse({ status: 201, description: 'QR token created' })
  async initiateQr(@Request() req) {
    const baseUrl = process.env.PUBLIC_PORTAL_URL || 'http://localhost:5173';
    return this.membersService.createQrSession(req.user.sub, baseUrl);
  }

  @Get('checkin/qr/:token')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get QR session info (admin)' })
  async getQr(@Param('token') token: string) {
    return this.membersService.getQrSession(token);
  }

  @Post('checkin/qr/:token/decision')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Approve or deny QR check-in (admin)' })
  async decideQr(@Param('token') token: string, @Body() body: QrDecisionInput) {
    return this.membersService.finalizeQrCheckIn(token, body.approve, body.notes);
  }
}

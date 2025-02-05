import { SystemSettingFieldsEnum } from '~/drizzle/schemas'
import { UserRole } from './enum.config'

export const UserRoleDict = new Map([
  [UserRole.Admin, '管理员'],
  [UserRole.Test, '测试员'],
])

export const SystemSettingFieldsDict = new Map<SystemSettingFieldsEnum | string, string>([
  [SystemSettingFieldsEnum.AdminUsername, '管理员账号'],
  [SystemSettingFieldsEnum.AdminPassword, '管理员密码'],
  [SystemSettingFieldsEnum.AIApiURL, 'AIGC API 地址'],
  [SystemSettingFieldsEnum.AIApiKey, 'AIGC API Key'],
])

export const ComplatedDict = new Map([
  [true, '已完成'],
  [false, '未完成'],
])

import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { EnumTheme } from '../interfaces/interfaces';

export class UpdateAppSettingsDto {
  @IsBoolean({
    message:
      '*Salvar_Histórico_De_Imagem formato de dados inadequado para envio',
  })
  @IsNotEmpty({ message: '*Salvar_Histórico_De_Imagem não pode estar vazio' })
  saveImageHistory: boolean;

  @IsBoolean({
    message:
      '*Ativar_Alerta_De_Notificações, formato de dados inadequado para envio',
  })
  @IsNotEmpty({
    message: '*Ativar_Alerta_De_Notificações não pode estar vazio',
  })
  enableNutricionalAlert: boolean;

  @IsBoolean({
    message: '*Partilha_De_Dados, envio de formado de dados inadequado',
  })
  @IsNotEmpty({ message: '*Partilha_De_Dados não pode estar vazio' })
  shareDataForTraining: boolean;

  @IsBoolean({
    message: '*Ativar_Notificações, formato de dados inadequado para envio',
  })
  @IsNotEmpty({ message: '*Ativar_Notificações não pode estar vazio' })
  notificationEnabled: boolean;

  @IsString({ message: '*thema deve ser um texto' })
  @IsNotEmpty({ message: '*tema não pode estar vazio' })
  theme: EnumTheme;
}

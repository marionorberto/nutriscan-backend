import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { EnumTheme } from '../interfaces/interfaces';

export class UpdateAppSettingsDto {
  @IsBoolean({
    message:
      '*Salvar_Histórico_De_Imagem formato de dados inadequado para envio',
  })
  @IsNotEmpty({ message: '*Salvar_Histórico_De_Imagem não pode estar vazio' })
  @IsOptional()
  saveImageHistory: boolean;

  @IsBoolean({
    message:
      '*Ativar_Alerta_De_Notificações, formato de dados inadequado para envio',
  })
  @IsNotEmpty({
    message: '*Ativar_Alerta_De_Notificações não pode estar vazio',
  })
  @IsOptional()
  enableNutricionalAlert: boolean;

  @IsBoolean({
    message: '*Partilha_De_Dados, envio de formado de dados inadequado',
  })
  @IsNotEmpty({ message: '*Partilha_De_Dados não pode estar vazio' })
  @IsOptional()
  shareDataForTraining: boolean;

  @IsBoolean({
    message: '*Ativar_Notificações, formato de dados inadequado para envio',
  })
  @IsNotEmpty({ message: '*Ativar_Notificações não pode estar vazio' })
  @IsOptional()
  notificationEnabled: boolean;

  @IsString({ message: '*thema deve ser um texto' })
  @IsNotEmpty({ message: '*tema não pode estar vazio' })
  @IsOptional()
  theme: EnumTheme;

  @IsNotEmpty({ message: '*id não pode estar vazio' })
  id: string;
}

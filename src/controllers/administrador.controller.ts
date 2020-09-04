import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {generate} from 'generate-password';
import {PasswordKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Administrador} from '../models';
import {EmailNotification} from '../models/email-notification.model';
import {AdministradorRepository, UsuarioRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';
import {NotificationService} from '../services/notification.service';

class Credentials {
  correo: string;
  clave: string;
}

export class AdministradorController {
  auth: AuthService;
  constructor(
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  ) {this.auth = new AuthService(usuarioRepository, administradorRepository)}

  @post('/login-adminn', {
    responses: {
      '200': {
        description: 'Login for admin'
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<object> {
    let admin = await this.auth.Identifyadmin(credentials.correo, credentials.clave);
    if (admin) {
      let tk = await this.auth.GenerateTokenadmin(admin);
      return {
        data: admin,
        token: tk
      }
    } else {
      throw new HttpErrors[401]("admin or Password invalid.");
    }
  }




  @post('/administradores', {
    responses: {
      '200': {
        description: 'Envia un email',
        content: {'application/json': {schema: getModelSchemaRef(EmailNotification)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailNotification, {
            title: 'Email'
          }),
        },
      },
    })
    email: EmailNotification,
  ): Promise<EmailNotification> {


    console.log("email")
    console.log(email.textBody)
    console.log(email.htmlBody)
    console.log(email.to)
    console.log(email.subject)



    let notification = new EmailNotification({
      textBody: email.textBody,
      htmlBody: email.htmlBody,
      to: email.to,
      subject: email.subject
    });
    await new NotificationService().MailNotification(notification);
    return notification;
  }

  @get('/administradores/count', {
    responses: {
      '200': {
        description: 'Administrador model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.count(where);
  }

  @get('/administradores', {
    responses: {
      '200': {
        description: 'Array of Administrador model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Administrador, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Administrador) filter?: Filter<Administrador>,
  ): Promise<Administrador[]> {
    return this.administradorRepository.find(filter);
  }

  @patch('/administradores', {
    responses: {
      '200': {
        description: 'Administrador PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.updateAll(administrador, where);
  }

  @get('/administradores/{id}', {
    responses: {
      '200': {
        description: 'Administrador model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Administrador, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Administrador, {exclude: 'where'}) filter?: FilterExcludingWhere<Administrador>
  ): Promise<Administrador> {
    return this.administradorRepository.findById(id, filter);
  }

  @patch('/administradores/{id}', {
    responses: {
      '204': {
        description: 'Administrador PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.updateById(id, administrador);
  }

  @put('/administradores/{id}', {
    responses: {
      '204': {
        description: 'Administrador PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.replaceById(id, administrador);
  }

  @del('/administradores/{id}', {
    responses: {
      '204': {
        description: 'Administrador DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administradorRepository.deleteById(id);
  }
}

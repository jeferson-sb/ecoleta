## Endpoins

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ecoleta%20API&uri=https%3A%2F%2Fgithub.com%2Fjeferson-sb%2Fecoleta%2Ftree%2Fmaster%2F.github%2FInsomnia_2020-06-13.json)

`GET` **/api/items** - Listar items

`GET` **/api/points** - Listar pontos filtrados

- Query Parameters

| Nome           | Descrição                             |
| -------------- | ------------------------------------- |
| city (string)  | Nome da cidade                        |
| uf (string)    | Unidade da Federação                  |
| items (string) | Itens de coleta separados por vírgula |

`POST` **/api/points** - Criar ponto de coleta

- Body (Multipart)

| Nome               | Descrição                             |
| ------------------ | ------------------------------------- |
| name (string)      | Nome do ponto                         |
| email (string)     | E-mail de contato                     |
| whatsapp (string)  | Whatsapp de contato                   |
| latitude (number)  | latitude do ponto                     |
| longitude (number) | longitude do ponto                    |
| city (string)      | Nome da cidade                        |
| uf (string)        | UF da cidade                          |
| items (string)     | Itens de coleta separados por vírgula |
| image (file)       | Imagem do ponto de coleta             |

`GET` **/api/points/:id** - Obter ponto de coleta

- URL Parameters

| Nome        | Descrição             |
| ----------- | --------------------- |
| id (number) | ID do ponto de coleta |

`PUT` **/api/points/:id** - Editar ponto de coleta

- Body (JSON)

```json
{
  "name": "Pão de Açucar",
  "email": "contato@paodeacucar.com",
  "whatsapp": "2162204123",
  "latitude": -22.6694699,
  "longitude": -45.7356112,
  "city": "Rio de Janeiro",
  "uf": "RJ"
}
```

`DELETE` **/api/points/:id** - Remover ponto de coleta

- URL Parameters

| Nome        | Descrição             |
| ----------- | --------------------- |
| id (number) | ID do ponto de coleta |

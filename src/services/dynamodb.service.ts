import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamodbService {
  private readonly document: DynamoDBDocument;
  public key: string = 'id';

  constructor(private configService: ConfigService) {
    const client = new DynamoDBClient({
      region: this.configService.get<string>('AWS_DYNAMODB_REGION'),
      endpoint: this.configService.get<string>('AWS_DYNAMODB_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_DYNAMODB_ACCESS_KEY_ID',
        ),
        secretAccessKey: this.configService.get<string>(
          'AWS_DYNAMODB_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.document = DynamoDBDocument.from(client);
  }

  async getAll(tableName: string) {
    const data = await this.document.scan({
      TableName: tableName,
    });

    return data.Items;
  }

  async getById(tableName: string, id: string) {
    const data = await this.document.get({
      TableName: tableName,
      Key: {
        [this.key]: id,
      },
    });

    return data.Item;
  }

  async store(tableName: string, data: any) {
    const res = await this.document.put({
      TableName: tableName,
      Item: data,
    });

    return res;
  }

  async update(tableName: string, data: any) {
    const key = data[this.key];
    delete data[this.key];

    // Tạo biểu thức UpdateExpression và ExpressionAttributeValues
    const updateFields = Object.keys(data)
      .map((key) => `#${key} = :${key}`)
      .join(', ');

    const expressionAttributeNames = Object.keys(data).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {});

    const expressionAttributeValues = Object.keys(data).reduce((acc, key) => {
      acc[`:${key}`] = data[key];
      return acc;
    }, {});

    const res = await this.document.update({
      TableName: tableName,
      Key: {
        [this.key]: key,
      },
      UpdateExpression: `SET ${updateFields}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
    });

    return res;
  }
}

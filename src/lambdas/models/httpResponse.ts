import { APIGatewayProxyResult } from "aws-lambda"

export interface ICorsHeaders {
  "Content-Type": string
  "Allow": string
  "Access-Control-Allow-Headers": string
  "Access-Control-Allow-Methods": string
  "Access-Control-Allow-Origin": string
}
export const CorsHeaders: ICorsHeaders = {
  "Content-Type": "application/json",
  "Allow": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
}
// node_modules/@types/aws-lambda/trigger/api-gateway-proxy.d.ts
abstract class HttpResponse implements APIGatewayProxyResult {
  statusCode: number
  body: string
  headers?: {
    [header: string]: boolean | number | string;
} | undefined
  constructor(statusCode: number, body = '') {
    this.statusCode = statusCode
    this.body = body
    this.headers = {...CorsHeaders}
  }
}
export class HttpSuccess extends HttpResponse {
  constructor(body?: string) {
    super(200, body)
  }
}
export class HttpFailure extends HttpResponse {
  constructor(body?: string) {
    super(400, body)
  }
}
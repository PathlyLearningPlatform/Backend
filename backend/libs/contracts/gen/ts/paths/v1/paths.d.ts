import { Observable } from "rxjs";
import { SortType } from "../../common/types.js";
export declare const protobufPackage = "proto.paths.v1";
export declare enum PathsOrderByFields {
    NAME = 0,
    CREATED_AT = 1,
    UPDATED_AT = 2
}
export interface Path {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
}
export interface FindPathsWhere {
    limit?: number | undefined;
    page?: number | undefined;
    sortType?: SortType | undefined;
    orderBy?: PathsOrderByFields | undefined;
}
export interface FindOnePathWhere {
    id: string;
}
export interface UpdatePathWhere {
    id: string;
}
export interface RemovePathWhere {
    id: string;
}
export interface UpdatePathFields {
    name?: string | undefined;
    description?: string | undefined;
}
export interface FindPathsRequest {
    where?: FindPathsWhere | undefined;
}
export interface FindPathsResponse {
    paths: Path[];
}
export interface FindOnePathRequest {
    where: FindOnePathWhere | undefined;
}
export interface FindOnePathResponse {
    path: Path | undefined;
}
export interface CreatePathRequest {
    name: string;
    description?: string | undefined;
}
export interface CreatePathResponse {
    path: Path | undefined;
}
export interface UpdatePathRequest {
    where: UpdatePathWhere | undefined;
    fields?: UpdatePathFields | undefined;
}
export interface UpdatePathResponse {
    path: Path | undefined;
}
export interface RemovePathRequest {
    where: RemovePathWhere | undefined;
}
export interface RemovePathResponse {
    path: Path | undefined;
}
export declare const PROTO_PATHS_V1_PACKAGE_NAME = "proto.paths.v1";
export interface PathsServiceClient {
    find(request: FindPathsRequest): Observable<FindPathsResponse>;
    findOne(request: FindOnePathRequest): Observable<FindOnePathResponse>;
    create(request: CreatePathRequest): Observable<CreatePathResponse>;
    update(request: UpdatePathRequest): Observable<UpdatePathResponse>;
    remove(request: RemovePathRequest): Observable<RemovePathResponse>;
}
export interface PathsServiceController {
    find(request: FindPathsRequest): Observable<FindPathsResponse>;
    findOne(request: FindOnePathRequest): Observable<FindOnePathResponse>;
    create(request: CreatePathRequest): Observable<CreatePathResponse>;
    update(request: UpdatePathRequest): Observable<UpdatePathResponse>;
    remove(request: RemovePathRequest): Observable<RemovePathResponse>;
}
export declare function PathsServiceControllerMethods(): (constructor: Function) => void;
export declare const PATHS_SERVICE_NAME = "PathsService";
//# sourceMappingURL=paths.d.ts.map
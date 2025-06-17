import { ApiErrorResponseEntity } from '@api/common/entities/api-error-response.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { DictionariesService } from '@api/controllers/dictionaries/dictionaries.service';
import { DictionariesListEntity } from '@api/controllers/dictionaries/entities/dictionaries-list.entity';
import { DictionaryCollectionEntity } from '@api/controllers/dictionaries/entities/dictionary-collection.entity';
import { MakesDictionaryCollectionEntity } from '@api/controllers/dictionaries/entities/makes-dictionary-collection.entity';
import { ModelsDictionaryCollectionEntity } from '@api/controllers/dictionaries/entities/models-dictionary-collection.entity';
import {
  CountryPhoneFormatDto,
  DictionariesListDto,
  DictionaryCollectionDto,
  DictionaryDto,
  MakesDictionaryDto,
  ModelsDictionaryDto,
  RegionDictionaryItemDto,
  VehicleOptionDictionaryItemDto,
} from '@data-access';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseGuards, Query, UseInterceptors, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

@ApiTags('Dictionaries')
@Controller('/dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/dictionaries/regions' },
      { service: 'P', method: 'GET', url: 'api/v1/dictionaries/colors' },
      { service: 'P', method: 'GET', url: 'api/v1/dictionaries/body-types' },
      { service: 'P', method: 'GET', url: 'api/v1/dictionaries/comfort-levels' },
      { service: 'P', method: 'GET', url: 'api/v1/dictionaries/options' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/makes' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionariesListEntity })
  public getAllReferences(@UserToken() token: Jwt): Observable<DictionariesListDto> {
    return this.dictionariesService.getAllDictionaries(token);
  }

  @Get('/regions')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/regions' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getRegionsDictionary(): Observable<DictionaryCollectionDto<RegionDictionaryItemDto>> {
    return this.dictionariesService.getRegionsDictionary();
  }

  @Get('/colors')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/colors' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getColorsDictionary(@UserToken() token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.dictionariesService.getColorsDictionary(token);
  }

  @Get('/body-types')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/body-types' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getBodyTypesDictionary(@UserToken() token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.dictionariesService.getBodyTypesDictionary(token);
  }

  @Get('/comfort-levels')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/comfort-levels' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getComfortLevelsDictionary(@UserToken() token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.dictionariesService.getComfortLevelsDictionary(token);
  }

  @Get('/options')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/options' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getOptionsDictionary(
    @UserToken() token: Jwt,
    @Query('regionId') regionId: number,
  ): Observable<DictionaryCollectionDto<VehicleOptionDictionaryItemDto>> {
    return this.dictionariesService.getOptionsDictionary(token, regionId);
  }

  @Get('/makes')
  @UseGuards(AuthGuard)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/makes' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: MakesDictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
  public getVehicleMakes(@UserToken() token: Jwt): Observable<DictionaryCollectionDto<MakesDictionaryDto>> {
    return this.dictionariesService.getVehicleMakesDictionary(token);
  }

  @Get('/models')
  @UseGuards(AuthGuard)
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/models' }]))
  @ApiQuery({ name: 'make_id', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ModelsDictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
  public getVehicleModels(
    @UserToken() token: Jwt,
    @Query('make_id') make_id: string,
  ): Observable<DictionaryCollectionDto<ModelsDictionaryDto>> {
    return this.dictionariesService.getVehicleModelsDictionary(token, make_id);
  }

  @Get('/country-phone-formats')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/dictionaries/country-phone-formats' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ModelsDictionaryCollectionEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
  public getCountriesPhoneFormats(): Observable<DictionaryCollectionDto<CountryPhoneFormatDto>> {
    return this.dictionariesService.getCountriesPhoneFormats();
  }
}

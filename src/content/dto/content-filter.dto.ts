import { ApiProperty } from '@nestjs/swagger';

export class ContentFilterDto {
  @ApiProperty({
    description:
      "This object specifies search conditions within the 'data' field.",
    example: { key: 'value' },
    type: Object,
    required: false,
  })
  data: any;

  @ApiProperty({
    description:
      "This object specifies search conditions within the 'dataSchema' field.",
    example: { key: 'value' },
    type: Object,
    required: false,
  })
  dataSchema: any;
}

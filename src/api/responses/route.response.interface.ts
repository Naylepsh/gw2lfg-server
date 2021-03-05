/**
 * Common interface for route responses.
 * Forces controllers that return resources to put them into data field.
 */
export interface IRouteResponse<DataType> {
  data?: DataType;
}

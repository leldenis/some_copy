Modules that are not directly related to the application, but can be called by an external source.

|   | Path                      | Query params               | Module                | Description                                                                 |
|---|---------------------------|----------------------------|-----------------------|-----------------------------------------------------------------------------|
| 1 | `/vehicles/create`        | token, fleet_id, language  | vehicle-create        | [Adding cars to fleets](https://uklonua.atlassian.net/browse/PF-484)        |
| 2 | `/vehicles/ticket`        | token, ticket_id           | vehicle-ticket        | [Ticket editing screen](https://uklonua.atlassian.net/browse/PF-508)        |
| 3 | `/vehicles/photo-control` | token, ticket_id, language | vehicle-photo-control | [Ticket photo control screen](https://uklonua.atlassian.net/browse/PF-1303) |

1. `/vehicles/create?token={token}&fleet_id={uid}&language={string}`
2. `/vehicles/ticket?token={token}&ticket_id={uid}`
3. `/vehicles/photo-control?token=nsQVfLkH5sHqeyWQg7JimJnXcW7TU1v1GzjH60owAJ24tR5Kb0nwOLWGVF4PYK8uaXXd8NYkWemv3JITXv3sF8rfMdlxYBsI2aQ4bn/vImI=&ticket_id=63af132c-7c8b-4bd7-9bcd-8a05e173eaf7&language=en`

# TODO I run out of time here

Feature: Product API
  Scenario: When I make a GET request to /products I get a list of all products
    Given the DB_URI env var is set to "sqlite::memory:"
    And I am running the API locally
    When I make a GET request to /products
    Then The response status is OK
    And The response matches the "products/getProducts" schema

  Scenario: When I make a GET request to /products/search I get a list of all products
    Given the DB_URI env var is set to "sqlite::memory:"
    And I am running the API locally
    And The query parameters are
    """
    {
      "name": "ban"
    }
    """
    When I make a GET request to /products/search
    Then The response status is OK
    And The response[0].name is "banana"

  Scenario: When I make a PATCH request to /products/12 the old product is modified
    Given the DB_URI env var is set to "sqlite::memory:"
    And I am running the API locally
    And the request body is
    """
    {
      "price": 1.01
    }
    """
    When I make a PUT request to /products/1
    Then The response status is OK

    When I make a GET request to /products/search?id=1
    Then The response status is OK
    And The response[0].price is 1.01

  Scenario: When I make a PUT request to /products the old products are replaced with new ones
    Given the DB_URI env var is set to "sqlite::memory:"
    And I am running the API locally
    And the request body is
    """
    [
      {
        "name": "melon",
        "price": 1.01,
        "stock": 3,
        "updated": "2014-03-28"
      },
      {
        "name": "apple",
        "price": 1.54,
        "stock": 22,
        "updated": "2014-02-05"
      }
    ]
    """
    When I make a PUT request to /products
    Then The response status is OK
    And The response matches the "products/getProducts" schema

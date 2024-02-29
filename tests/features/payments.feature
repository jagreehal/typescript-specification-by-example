Feature: Paying Employees

  Scenario: When paying people for the work they have done
    Given the following people are employed
      | Email               | Name    |
      | bob@example.com     | Bob     |
      | joe@example.com     | Joe     |
      | margret@example.com | Margret |
    And they spent this time on the project
      | Email               | Days |
      | bob@example.com     |    1 |
      | joe@example.com     |    5 |
      | margret@example.com |    2 |
    And they each gets paid £5 a day
    When I do the payrun
    Then the payments should be
      | Email               | Amount |
      | bob@example.com     |      5 |
      | joe@example.com     |     25 |
      | margret@example.com |     10 |

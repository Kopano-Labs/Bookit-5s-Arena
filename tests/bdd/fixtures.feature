@fixtures @blackbox @mobile
Feature: Fixtures page reliability
  As a mobile user on FivesArena
  I need the Fixtures page to stay useful under bad data and bad networks
  So I can see what matches matter, when they are, and what to do next within 5 seconds

  # Page law (acceptance anchor): observable on mobile, implementation-agnostic.

  # ---------------------------------------------------------------------------
  # Empty & partial provider data
  # ---------------------------------------------------------------------------

  @critical @provider-failure
  Scenario: League feed returns no fixtures
    Given the user opens the Fixtures page on a mobile viewport
    And the selected league has no fixtures from the provider
    When the page finishes loading
    Then the user should see a non-technical empty state
    And the page should not show provider jargon
    And the user should still be able to switch to another league

  @critical @provider-failure
  Scenario: Some leagues are empty but others have data
    Given the provider returns fixtures for 1 of 27 leagues
    And the remaining 26 leagues return empty arrays
    When the fixtures page is opened
    Then leagues with fixtures should render normally
    And leagues without fixtures should show graceful empty states
    And the page layout should remain intact

  @critical @provider-failure
  Scenario Outline: Every league degrades gracefully when empty
    Given the user opens the Fixtures page
    And the "<league>" feed returns no fixtures
    When the page finishes loading
    Then the user should see a graceful empty state for "<league>"
    And no technical error text should be shown

    Examples:
      | league                  |
      | World Cup               |
      | Nations League          |
      | Premier League          |
      | UCL                     |
      | UEL                     |
      | UECL                    |
      | La Liga                 |
      | Serie A                 |
      | Bundesliga              |
      | Ligue 1                 |
      | Eredivisie              |
      | Primeira Liga           |
      | Belgian Pro             |
      | Scottish Prem           |
      | Süper Lig               |
      | MLS                     |
      | Brasileirao             |
      | Primera                 |
      | Liga MX                 |
      | PSL                     |
      | Egypt PL                |
      | CAF CL                  |
      | CAF CC                  |
      | Saudi Pro               |
      | J1                      |
      | K League                |
      | AFC CL                  |

  # ---------------------------------------------------------------------------
  # Vault, cache, and offline (Commandment IX)
  # ---------------------------------------------------------------------------

  @critical @offline @vault
  Scenario: Provider times out but cached fixtures exist
    Given the user has a previously cached fixtures snapshot on this device
    And the provider request times out
    When the fixtures page is opened
    Then the page should show the cached fixtures
    And the page should label the data as last updated or saved
    And the user should see a way to retry or refresh

  @critical @offline @vault
  Scenario: User is offline with cached fixtures
    Given the device is offline
    And league fixtures were previously cached on this device
    When the fixtures page is opened
    Then cached fixtures should be shown
    And the page should indicate that the content may be stale
    And no raw network error should be shown

  @critical @offline @vault
  Scenario: User is offline with no cached fixtures
    Given the device is offline
    And no fixtures have been cached before on this device
    When the fixtures page is opened
    Then the user should see an offline empty state
    And the message should explain what to do next
    And the page should not render blank cards

  @offline @vault
  Scenario: Vault freshness is visible while refreshing
    Given the user has a cached fixtures snapshot on this device
    And the network is available
    When the fixtures page is opened
    Then the user should see fixtures immediately from saved data or live data
    And while a refresh is in progress the page should indicate saved data is being updated
    And the layout should not flash blank between states

  # ---------------------------------------------------------------------------
  # Match status and scheduling boundaries
  # ---------------------------------------------------------------------------

  @critical
  Scenario: Fixture is postponed
    Given a fixture is marked postponed by the provider
    When the user views that match card
    Then the status should read Postponed
    And the kickoff time should not be presented as live
    And no score call-to-action should appear

  @critical
  Scenario: Fixture is cancelled
    Given a fixture is marked cancelled by the provider
    When the user views that match card
    Then the status should read Cancelled
    And the kickoff time should not be presented as live
    And no score call-to-action should appear

  @critical @target
  Scenario: Fixtures cross midnight
    Given a fixture starts at 23:30 local time
    And another fixture starts at 00:15 the next day
    When the user views Today and Upcoming
    Then each fixture should appear under the correct date group
    And the ordering should follow local timezone

  @provider-failure
  Scenario: Invalid kickoff timestamp is not shown to the user
    Given the provider returns a fixture with an invalid kickoff value
    When the user views the fixtures list
    Then the user should see a readable kickoff label or a safe time placeholder
    And the user should not see a raw epoch number or JSON fragment

  # ---------------------------------------------------------------------------
  # Data integrity & malformed payloads
  # ---------------------------------------------------------------------------

  @critical
  Scenario: Duplicate fixture arrives from provider
    Given the provider returns the same fixture twice
    When the page renders the league list
    Then the fixture should appear only once
    And the page should not show duplicate cards

  @critical
  Scenario: Provider leaks malformed team data
    Given the provider returns a fixture with a missing away team name
    When the page renders the fixtures list
    Then the page should show a safe fallback label
    And the layout should not break
    And the user should not see null, undefined, or raw JSON

  @provider-failure
  Scenario: Provider leaks malformed venue data
    Given the provider returns a fixture with a missing venue name
    When the page renders the fixtures list
    Then the page should show a neutral venue placeholder
    And the match card layout should remain intact

  # ---------------------------------------------------------------------------
  # Navigation, filters, and league switching
  # ---------------------------------------------------------------------------

  @critical
  Scenario: User applies a filter with zero matches
    Given the fixtures page has loaded successfully
    When the user filters by a league with no matching fixtures
    Then the page should show a zero-results state
    And the filter controls should remain visible
    And the user should be able to clear the filter

  @critical
  Scenario: User switches league after an empty feed
    Given the user is viewing a league with no fixtures
    When the user selects a different league
    Then the page should load the new league without a full reload error
    And the previous league's empty state should not persist on screen

  @critical @blackbox-shield
  Scenario: Non-Premier League surface is shielded during recovery
    Given the fixtures recovery shield is active
    And the user opens a non-Premier League competition
    When the page finishes loading
    Then the user should see a recovery message instead of a broken blank hub
    And the user should be able to open the Premier League hub

  @critical @blackbox-shield
  Scenario: Premier League hub remains reachable during recovery
    Given the fixtures recovery shield is active
    When the user chooses to open the Premier League hub
    Then Premier League schedules standings or stats should be available
    And the user should not see provider configuration jargon

  # ---------------------------------------------------------------------------
  # Season and standings edge cases (demo failure class)
  # ---------------------------------------------------------------------------

  @critical @provider-failure
  Scenario: Future season selection does not look like total failure
    Given the user opens Premier League standings
    And the user selects a future season that is not published yet
    When the standings view finishes loading
    Then the user should see an explanatory season notice or the active season table
    And the user should not see a bare "standings unavailable" dead end

  @provider-failure
  Scenario: Future season stats do not look like total failure
    Given the user opens Premier League player stats
    And the user selects a future season that is not published yet
    When the stats view finishes loading
    Then the user should see an explanatory season notice or active season leaders
    And the user should not see a bare empty leaderboard with no context

  # ---------------------------------------------------------------------------
  # Information architecture (@target — Heavy BlackBox refactor)
  # ---------------------------------------------------------------------------

  @target @critical
  Scenario: User understands today's matches within five seconds
    Given the fixtures page has loaded on a mobile viewport
    And there are matches scheduled for today
    When the user lands on the default Fixtures view
    Then the user should see today's matches without scrolling past unrelated noise
    And each visible match should show teams status and kickoff time

  @target
  Scenario: PSL is easy to find for South African users
    Given the user opens the Fixtures page on a mobile viewport
    When the page finishes loading
    Then PSL should be pinned or reachable in one tap
    And PSL fixtures or a clear empty state should be shown

  @target
  Scenario: Local Arena fixtures are distinguishable from global leagues
    Given local arena fixtures exist for the user's region
    When the fixtures page is opened
    Then local arena fixtures should appear in a dedicated section
    And global league fixtures should not hide local arena content

  # ---------------------------------------------------------------------------
  # Home page strip (fixtures discovery)
  # ---------------------------------------------------------------------------

  @critical @vault
  Scenario: Home live strip degrades without embarrassment
    Given the featured matches feed is slow or empty
    When the user views the home page live fixtures strip
    Then the user should see a helpful message or saved strip data
    And the user should be offered a path to the full Fixtures page

  # ---------------------------------------------------------------------------
  # Release gate (meta acceptance)
  # ---------------------------------------------------------------------------

  @critical @release-gate
  Scenario: Fixtures health gate passes before a client demo
    Given a release candidate is ready for stakeholder review
    When the fixtures health check runs against production
    Then Premier League meta matches standings and stats checks should pass
    And at least one non-Premier League matches check should return a valid response shape
    And the build should fail if critical checks do not pass

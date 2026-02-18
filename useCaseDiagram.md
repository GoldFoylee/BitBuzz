graph TD
    User((User))
    Admin((Market Maker))
    
    User -->|Browse| UC1(View Trending Markets)
    User -->|Trade| UC2(Buy/Sell Shares)
    User -->|Monitor| UC3(View Portfolio)
    
    Admin -->|Setup| UC4(Create New Market)
    Admin -->|Settle| UC5(Resolve Outcome)
    
    UC2 -->|Validate| System((BitBuzz Backend))
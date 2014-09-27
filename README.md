= Push-to-deploy =
    cd swipes
    git clone keatonboyle@keatonboyle.net:html/swipes/repose/swipes.git .
    git checkout master
    # make changes
    git commit -am "message"

    # this checks out dev, merges master into it, and pushes 
    #  dev to origin, updating the dev subdomain
    ./deploy dev
    
    # this checks out live, merges master into it, and pushes 
    #  live to origin, updating the www page
    ./deploy live

import { useState, useRef, useEffect, useMemo } from "react";

const clusterData = {
  clusters: [
    { id: 1, name: "Strong Supporters", description: "Fully support blanket rezoning — cite housing crisis, affordability, climate, urban sprawl, and young people being priced out", color: "#22c55e", shortName: "Pro-Rezoning" },
    { id: 2, name: "Neighbourhood Defenders", description: "Oppose rezoning to protect single-family character, property values, lifestyle choices, and investments made in R1 communities", color: "#ef4444", shortName: "Anti-Rezoning" },
    { id: 3, name: "Infrastructure Skeptics", description: "Primary concern is whether roads, parking, sewers, schools, and utilities can handle increased density", color: "#f97316", shortName: "Infra Concerns" },
    { id: 4, name: "Developer/Process Critics", description: "Skeptical of who actually benefits — argue new units aren't affordable, developers profit, and the process lacks democracy", color: "#a855f7", shortName: "Process/Trust" },
    { id: 5, name: "Urbanist Voices", description: "Support rezoning but want MORE — higher density near LRT, mixed commercial use, walkable neighbourhoods, no parking minimums", color: "#3b82f6", shortName: "More Density" },
    { id: 6, name: "Immigration Attributers", description: "Attribute the housing crisis to immigration policy rather than zoning; advocate for population controls as the solution", color: "#6b7280", shortName: "Immigration Focus" },
    { id: 7, name: "Targeted Rezoning", description: "Support some rezoning but oppose blanket approach — prefer community-by-community, transit-adjacent, or older-neighbourhood focus", color: "#eab308", shortName: "Targeted Only" },
  ],
  comments: [
    { id: 1, text: "I am in favour of this change. The simple fact is that we need more housing. We can't keep building outward forever.", cluster: 1, x: 0.82, y: 0.65 },
    { id: 2, text: "Finally the city is removing low-density zoning and allowing more flexibility. Thank you! I have wanted to redevelop my lot for a while.", cluster: 1, x: 0.75, y: 0.45 },
    { id: 3, text: "This is a good step towards building a more affordable and sustainable city.", cluster: 1, x: 0.70, y: 0.72 },
    { id: 4, text: "BRING IT ON! We desperately need more housing options in this city.", cluster: 1, x: 0.90, y: 0.55 },
    { id: 5, text: "Amazing step in the right direction. Simply want these changes to happen faster!", cluster: 1, x: 0.85, y: 0.60 },
    { id: 6, text: "I live in a neighbourhood that is predominately single detached houses and support the re-zoning absolutely. Don't let the NIMBY contingent stop it!", cluster: 1, x: 0.78, y: 0.50 },
    { id: 7, text: "This change to zoning is absolutely necessary to ensure Calgarians have access to affordable housing.", cluster: 1, x: 0.80, y: 0.68 },
    { id: 8, text: "I am fully supportive of the proposed change in zoning across the city. We need more housing types and more housing supply.", cluster: 1, x: 0.76, y: 0.58 },
    { id: 9, text: "Brilliant idea. Full support. There is no way the current system is sustainable for current or future buyers.", cluster: 1, x: 0.88, y: 0.62 },
    { id: 10, text: "Please rezone & use all other tools you have to improve affordability. The interests of rich property owners should hold zero weight. Working people are becoming homeless.", cluster: 1, x: 0.72, y: 0.78 },
    { id: 11, text: "I'm a renter and I fully support this. More housing supply means lower rents and more choices for me.", cluster: 1, x: 0.74, y: 0.82 },
    { id: 12, text: "I support this. There's a lot of fear of change out there, but if we don't act, we're going to sprawl beyond what we can afford.", cluster: 1, x: 0.65, y: 0.55 },
    { id: 13, text: "I am really pleased to see proposed zoning changes. Calgary is in desperate need of housing at all levels of affordability.", cluster: 1, x: 0.68, y: 0.70 },
    { id: 14, text: "Young families are being priced out of Calgary. Rezoning is the only way to make housing accessible.", cluster: 1, x: 0.77, y: 0.75 },
    { id: 15, text: "Council please approve citywide rezoning! Cities with less single detached housing are vibrant and a joy to live in.", cluster: 1, x: 0.83, y: 0.58 },
    { id: 16, text: "We need this plan and I totally support it — all builders are booked years ahead. I couldn't buy a house simply because the waiting list is 2–3 years.", cluster: 1, x: 0.79, y: 0.60 },
    { id: 17, text: "I am completely against this rezoning proposal. You are destroying communities and the character of our neighbourhoods.", cluster: 2, x: -0.82, y: -0.60 },
    { id: 18, text: "I absolutely do NOT support the proposed rezoning. My preference would be to leave the zoning as is.", cluster: 2, x: -0.88, y: -0.55 },
    { id: 19, text: "I specifically chose the area in which I live in Varsity due to its lack of high density housing. Any increase will cause the current traffic issues to worsen.", cluster: 2, x: -0.75, y: -0.65 },
    { id: 20, text: "My wife and I worked hard to afford a home in a neighbourhood where there was space and homes were not crammed in. The extra traffic, parking issues and noise are things we were trying to avoid.", cluster: 2, x: -0.85, y: -0.58 },
    { id: 21, text: "Absolutely not — we purchased our home on the design and layout of the neighborhood at that time and have faithfully paid property taxes on that basis since.", cluster: 2, x: -0.80, y: -0.52 },
    { id: 22, text: "People have purchased homes in single detached neighborhoods for a reason. The lack of parking, noise and lack of privacy caused by this rezoning will ruin many residents' enjoyment.", cluster: 2, x: -0.72, y: -0.70 },
    { id: 23, text: "I do not support the blanket conversion of single family home neighborhoods to R-CG designation.", cluster: 2, x: -0.90, y: -0.45 },
    { id: 24, text: "I am firmly against rezoning of the neighborhood in which I currently reside. Infrastructure was built for the current housing utilization.", cluster: 2, x: -0.78, y: -0.62 },
    { id: 25, text: "I am 100% against blanket rezoning. Home owners have chosen to live in their R1 neighborhoods due to their legal zoning and this zoning should not change.", cluster: 2, x: -0.92, y: -0.48 },
    { id: 26, text: "Not in favour of the re-zoning changes. Any mayor or councillor that supports these changes will not receive a vote from me.", cluster: 2, x: -0.85, y: -0.42 },
    { id: 27, text: "Zone new communities any way you please, but leave existing neighbourhoods alone! Your own planners approved those neighbourhoods for a certain density.", cluster: 2, x: -0.68, y: -0.72 },
    { id: 28, text: "I chose my neighborhood specifically because it was zoned R1. Do not change this after I invested my life savings here.", cluster: 2, x: -0.82, y: -0.55 },
    { id: 29, text: "This is the wrong approach. When an area is built and zoned, this zoning should not change. People buy a home for the zoning and pay taxes accordingly.", cluster: 2, x: -0.76, y: -0.68 },
    { id: 30, text: "I oppose this change of direction. It is a betrayal of all homeowners in Calgary and the neighbourhoods we have chosen to purchase and live in.", cluster: 2, x: -0.83, y: -0.50 },
    { id: 31, text: "I am 100% against rezoning. It adds increased traffic, endless parking problems, noise and additional strain on amenities.", cluster: 2, x: -0.87, y: -0.65 },
    { id: 32, text: "Such wholesale, radical changes to zoning should be put to the public in a referendum. This is our city.", cluster: 4, x: -0.55, y: -0.25 },
    { id: 33, text: "My main concern is around parking. In communities with smaller lots there is already high demand for street parking for residents.", cluster: 3, x: -0.50, y: -0.78 },
    { id: 34, text: "The parking and roads many older low density communities can't accommodate this rezoning.", cluster: 3, x: -0.55, y: -0.82 },
    { id: 35, text: "Rezoning to increase housing density needs to be accompanied by upgrades to infrastructure including roads, utilities, sewer, water, drainage, electrical and schools.", cluster: 3, x: -0.40, y: -0.88 },
    { id: 36, text: "I am not supportive of rezoning without an infrastructure plan. All the neighborhood schools for the Chinook area are closed campuses. Where are all these children going to go to school?", cluster: 3, x: -0.45, y: -0.85 },
    { id: 37, text: "For R-CG zones, parking is 0.5 spots per unit. So if in a four-plex there would only be two parking spots, six cars will be parked on the street.", cluster: 3, x: -0.48, y: -0.80 },
    { id: 38, text: "I have a concern with council approving in areas that will greatly impact the traffic and safety for the community, children, and seniors.", cluster: 3, x: -0.38, y: -0.90 },
    { id: 39, text: "Our existing roads aren't ready for increasing traffic. Schools capacities are not ready for more kids. Water pipelines and infrastructure are not ready for increased population.", cluster: 3, x: -0.42, y: -0.86 },
    { id: 40, text: "I am concerned about density as it affects roads, traffic, on-street parking and especially road safety in my community.", cluster: 3, x: -0.52, y: -0.75 },
    { id: 41, text: "One key issue is parking. When you shift from a single occupancy dwelling to a multi family dwelling it often results in more vehicles. Neighborhoods are not geared to accommodate these vehicles.", cluster: 3, x: -0.58, y: -0.78 },
    { id: 42, text: "I am opposed to blanket rezoning across the city. Neighbourhoods should have the option to be excluded. Infrastructure was designed for lower density.", cluster: 3, x: -0.62, y: -0.72 },
    { id: 43, text: "I am worried about schools being at capacity. No plan exists for new schools to serve increased density.", cluster: 3, x: -0.45, y: -0.88 },
    { id: 44, text: "Rezoning is not the answer. Investors will gobble up land, create expensive condos, and the affordability issue remains. The new builds sell for $700–800k — not affordable.", cluster: 4, x: -0.45, y: 0.20 },
    { id: 45, text: "None of these dwellings could be remotely considered affordable housing. Developers are the only winners here.", cluster: 4, x: -0.50, y: 0.15 },
    { id: 46, text: "This is only benefiting developers who will buy single family homes and build a 4-plex or 6-plex to make large amounts of money.", cluster: 4, x: -0.48, y: 0.22 },
    { id: 47, text: "This appears to be a way to increase tax income rather than supplying affordable housing. The new denser housing is not affordable.", cluster: 4, x: -0.40, y: 0.18 },
    { id: 48, text: "Base rezoning does not automatically result in changes to housing affordability or changes to the types of housing built. This recklessly reduces builder oversight.", cluster: 4, x: -0.35, y: 0.12 },
    { id: 49, text: "I will fight against anything you do until you are all replaced at the next election. This council is completely out of touch.", cluster: 4, x: -0.70, y: -0.10 },
    { id: 50, text: "This consultation is a complete waste of time. City council will approve developer requests regardless of local residents opposing it.", cluster: 4, x: -0.60, y: -0.15 },
    { id: 51, text: "We have no reason to believe this council will listen to anything the citizens say. The outcome has already been determined.", cluster: 4, x: -0.65, y: -0.08 },
    { id: 52, text: "City council is planning to destroy my city! This whole process is a rubber stamp for what they've already decided.", cluster: 4, x: -0.72, y: -0.12 },
    { id: 53, text: "Rezoning is just helping developers make more money. This will not solve the housing crisis.", cluster: 4, x: -0.42, y: 0.25 },
    { id: 54, text: "Property values will decrease. The city should compensate existing homeowners if they proceed with this.", cluster: 4, x: -0.55, y: -0.05 },
    { id: 55, text: "H-GO should not have parking minimums at all and should be allowed city-wide. We need homes now. These changes should have been made 20–30 years ago.", cluster: 5, x: 0.88, y: 0.80 },
    { id: 56, text: "Follow the Strong Towns philosophies. Eliminate parking minimums, stop the continued expansion of the failed suburban experiment.", cluster: 5, x: 0.85, y: 0.85 },
    { id: 57, text: "Upzoning should be done City wide. Also allow commercial and industrial uses in neighbourhoods. No more zoning, eliminate parking minimums.", cluster: 5, x: 0.80, y: 0.88 },
    { id: 58, text: "This is not dense enough. We should have towers adjacent to LRT stations, not RC-G. We're talking about less than 100m from transit stations for crying out loud!", cluster: 5, x: 0.78, y: 0.90 },
    { id: 59, text: "I'm all for densification! I used to live in Montreal and the walkability is one of the things I miss most — would be great if Calgary could become more walkable.", cluster: 5, x: 0.72, y: 0.82 },
    { id: 60, text: "This is a great step in the right direction. I would ask for more density near transit lines. More mixed use buildings with residences above would be great.", cluster: 5, x: 0.75, y: 0.86 },
    { id: 61, text: "I don't think it goes far enough. You should allow small scale retail and commercial on lots that are currently residential. Think Europe, think Montreal.", cluster: 5, x: 0.68, y: 0.88 },
    { id: 62, text: "Perfect opportunity to take the first steps of creating walkable neighborhoods. Give people REASONS TO WALK. Add small commercial zoning: pubs, coffee shops, bakeries, book stores.", cluster: 5, x: 0.70, y: 0.92 },
    { id: 63, text: "Build more transit and density near LRT stations. That is the smart approach — not blanket rezoning everywhere but targeted upzoning near transit.", cluster: 7, x: 0.30, y: 0.75 },
    { id: 64, text: "Blanket rezoning is a ridiculous idea. Maintain most communities as single family residential — higher density needs to be focused on areas closer to downtown.", cluster: 7, x: -0.35, y: -0.35 },
    { id: 65, text: "I strongly oppose city wide rezoning. Rezoning should be limited to certain areas such as near transit hubs and retail hubs.", cluster: 7, x: -0.30, y: -0.30 },
    { id: 66, text: "Densification is important but it should be properly thought out and imposed only in areas that are well equipped to handle it, not a blanket policy.", cluster: 7, x: -0.25, y: -0.28 },
    { id: 67, text: "I believe that these efforts should not be done as a blanket. They should be done community by community. Blanket rezoning is a foolish and short-sighted tactic.", cluster: 7, x: -0.32, y: -0.40 },
    { id: 68, text: "Rezoning should not be done to the whole city at once, but to wards or communities in turn to allow for proper feedback.", cluster: 7, x: -0.28, y: -0.32 },
    { id: 69, text: "Stick to rezoning old neighbourhoods where houses are falling into disrepair and lots are big. That makes most sense financially and revitalizes those areas.", cluster: 7, x: -0.22, y: -0.38 },
    { id: 70, text: "I support Citywide rezoning up to the old communities from 1960–70. Those areas have large lots and wider roads — less density and traffic problems.", cluster: 7, x: 0.25, y: -0.20 },
    { id: 71, text: "I support rezoning near transit and activity centres. Communities far from transit haven't been made appealing enough to developers anyway.", cluster: 7, x: 0.35, y: 0.40 },
    { id: 72, text: "There is no housing crisis, there is an immigration crisis. How can there be no thought or planning in regards to the number of people allowed to enter Canada?", cluster: 6, x: -0.65, y: 0.40 },
    { id: 73, text: "The housing crisis has largely been created by the Federal Government through immigration policy. Limit immigration and the house problem will solve itself.", cluster: 6, x: -0.70, y: 0.45 },
    { id: 74, text: "Stop the influx of immigrants! Calgary needs to first limit population growth before implementing wide scale zoning changes.", cluster: 6, x: -0.75, y: 0.35 },
    { id: 75, text: "Perhaps our current immigration and foreign student targets need to be addressed before implementing wide scale zoning changes.", cluster: 6, x: -0.60, y: 0.42 },
    { id: 76, text: "Stop bringing people into Canada. Send those on student visas back. Then reassess the housing situation. Canada brought in 1.2 million people last year.", cluster: 6, x: -0.68, y: 0.38 },
    { id: 77, text: "We are totally against arbitrary rezoning. Rezoning will not provide affordable housing — it will only make industry richer and current homeowners poorer.", cluster: 2, x: -0.78, y: -0.75 },
    { id: 78, text: "Removing RC-1 zoning will result in significantly reduced tree canopies in the city, increasing our carbon footprint and air pollution.", cluster: 2, x: -0.65, y: -0.45 },
    { id: 79, text: "The urban tree canopy will be decimated. Large trees take decades to grow and will be lost forever when lots are cleared for density.", cluster: 2, x: -0.62, y: -0.48 },
    { id: 80, text: "Blanket rezoning is contrary to the aesthetics of communities. Established trees have to be removed and remaining land is too small to support new ones. Contrary to goals of expanding the urban tree canopy.", cluster: 2, x: -0.68, y: -0.42 },
    { id: 81, text: "I am not happy about the so called affordable housing rezoning. Developers and city officials who work closely with developers will get rich.", cluster: 4, x: -0.52, y: 0.28 },
    { id: 82, text: "I am deeply concerned this is politically and ideologically driven. The primary beneficiaries will be developers. Neighbourhoods will decline.", cluster: 4, x: -0.58, y: 0.22 },
    { id: 83, text: "I support housing diversity. However, the new housing being built is NOT affordable. They cost $800–900k. Who is saving money by buying a $600k row house?", cluster: 4, x: -0.38, y: 0.35 },
    { id: 84, text: "Rezoning is necessary for climate goals and to stop urban sprawl. We need walkable communities and Calgary needs to stop growing outward.", cluster: 1, x: 0.73, y: 0.88 },
    { id: 85, text: "Climate change requires density. We cannot keep sprawling outward and burning more fuel for commutes. This is the right approach.", cluster: 1, x: 0.76, y: 0.85 },
    { id: 86, text: "I am very happy to see the city working towards better use of existing spaces rather than continually adding new low-density communities that are destroying wetlands.", cluster: 1, x: 0.71, y: 0.80 },
    { id: 87, text: "I am a landlord and support rezoning. It will allow me to build a secondary suite and provide more housing options on my property.", cluster: 1, x: 0.65, y: 0.48 },
    { id: 88, text: "We need affordable housing urgently. Rezoning is a start but needs to be paired with rent controls and other measures.", cluster: 1, x: 0.60, y: 0.78 },
    { id: 89, text: "I trust the legal system to uphold restrictive covenants. Rezoning cannot override these private contracts between neighbours.", cluster: 2, x: -0.58, y: -0.30 },
    { id: 90, text: "Council's authority to re-zone cannot supersede private restrictive covenants. Administration or Council's view of the future should never trump what private owners covenant with one another.", cluster: 2, x: -0.62, y: -0.28 },
    { id: 91, text: "Your rezoning proposal appears to be contravention of the Restrictive Covenants in our community (max 2 dwellings per lot). Please explain!", cluster: 2, x: -0.60, y: -0.32 },
    { id: 92, text: "Strongly opposed to this virtue signalling that only benefits developers and actually decreases affordable housing.", cluster: 4, x: -0.62, y: 0.32 },
    { id: 93, text: "I feel Council and Administration are selling out established communities to receive federal funding. Citizens were not truly consulted.", cluster: 4, x: -0.58, y: 0.18 },
    { id: 94, text: "This plan does not ensure that new houses are actually affordable. Rezoning does nothing to lower prices.", cluster: 4, x: -0.35, y: 0.30 },
    { id: 95, text: "I would like to see incentives for developers to build small and affordable housing. Developers in Calgary have too much power. Not enough starter homes being built.", cluster: 4, x: -0.20, y: 0.40 },
    { id: 96, text: "I believe that rezoning will increase property values, as it will encourage more amenities like convenience stores and cafés in communities.", cluster: 1, x: 0.67, y: 0.52 },
    { id: 97, text: "I think a major housing type that is completely under-represented is co-housing. I would be EVEN MORE in support if co-housing was a priority.", cluster: 5, x: 0.65, y: 0.75 },
    { id: 98, text: "Denser is better. The city should permit high rises within a wide radius of major transit. Low rises should be permitted everywhere. Build up not out!", cluster: 5, x: 0.82, y: 0.88 },
    { id: 99, text: "I am against re-zoning. We bought in R1 to avoid secondary suites and do not want the value of the single homes to depreciate.", cluster: 2, x: -0.80, y: -0.58 },
    { id: 100, text: "I live in Lake Bonavista and completely disagree with allowing any changes to our zoning for housing. This community is developed completely and no additional development should be allowed.", cluster: 2, x: -0.83, y: -0.62 },
    { id: 101, text: "As a Calgary homeowner in West Hillhurst, I strongly support rezoning that will allow increased densification. It is currently far too difficult for developers to create new projects.", cluster: 1, x: 0.78, y: 0.55 },
    { id: 102, text: "I am not in favor of rezoning. It does not consider the demands on existing infrastructure — roads, sewers, water lines, schools, electrical systems.", cluster: 3, x: -0.50, y: -0.80 },
    { id: 103, text: "I am in favour because: Affordable homes in all communities will help lower income families. Calgary should be a place of opportunity for all.", cluster: 1, x: 0.72, y: 0.72 },
    { id: 104, text: "I am in favor of rezoning for easier creation of legal secondary suites — a sensible, incremental approach to adding housing.", cluster: 1, x: 0.55, y: 0.45 },
    { id: 105, text: "I do not wish this to happen. Rezoning does not solve the issue where current people living in Calgary can afford housing. Reduce property taxes instead.", cluster: 4, x: -0.48, y: -0.08 },
    { id: 106, text: "We purchased our home to raise a family in a single family home. The proposed changes would effectively eliminate the intimate neighbourhood feel.", cluster: 2, x: -0.77, y: -0.68 },
    { id: 107, text: "I live in Inglewood. I would love to be able to have a lane home and a basement suite. It baffles me that the city prevents me from doing that.", cluster: 1, x: 0.62, y: 0.42 },
    { id: 108, text: "I am 100% in favour of citywide rezoning. Many are challenged by housing. The sprawl is taxing services. Please carry on with this plan!", cluster: 1, x: 0.85, y: 0.68 },
    { id: 109, text: "I am fully 100% supportive of this proposed rezoning to house newcomers to Calgary and meet our climate objectives. I want rezoning to allow even higher density.", cluster: 1, x: 0.88, y: 0.82 },
    { id: 110, text: "The city should tackle unused and underused land within its limits first before rezoning established single family areas.", cluster: 7, x: -0.18, y: -0.25 },
    { id: 111, text: "The city should start with empty lots and underused industrial land before touching established neighborhoods.", cluster: 7, x: -0.20, y: -0.22 },
    { id: 112, text: "High density has adverse effects on many families because of reduced privacy. There is also a risk of increased crime rates.", cluster: 2, x: -0.58, y: -0.68 },
    { id: 113, text: "Failure to approve wide-level rezoning to increase the missing middle in housing will in the long term cause an affordability crisis. Council needs to ignore NIMBYs.", cluster: 1, x: 0.80, y: 0.72 },
    { id: 114, text: "This may impact my community but I support the changes. Increasing supply aids affordability. The city's long-term sustainability requires a smaller footprint with more transit trips.", cluster: 1, x: 0.68, y: 0.62 },
    { id: 115, text: "We need to make the city less sprawled and more concentrated so we have better transit and more walkability.", cluster: 5, x: 0.75, y: 0.85 },
    { id: 116, text: "We are not opposed to greater density, but parking requirements should not be relaxed. Setback requirements should match immediate neighbours.", cluster: 3, x: -0.30, y: -0.72 },
    { id: 117, text: "I would be supportive of rezoning if there was a commitment to affordable housing in the new zoned areas and not expensive condos sold for $800k.", cluster: 4, x: -0.15, y: 0.48 },
    { id: 118, text: "I love that it will be easier to create secondary suites in our neighbourhood, adding capacity to the existing area that has a relatively low population density.", cluster: 1, x: 0.70, y: 0.50 },
    { id: 119, text: "I think rezoning is great. However the basement suite building regulations need revision. The requirement for a second furnace is too big an obstacle financially.", cluster: 1, x: 0.50, y: 0.38 },
    { id: 120, text: "I support any zoning changes as long as they support those who need housing instead of people who intend to rezone for profit. Low income housing should be a priority.", cluster: 4, x: 0.10, y: 0.65 },
    { id: 121, text: "Moving from RC-1 to RC-G is too drastic of a change for community dynamics. Single family homes, rowhouses and condos need to be in separate groupings.", cluster: 7, x: -0.38, y: -0.45 },
    { id: 122, text: "Blanket rezoning needs to be subject to a city wide plebiscite. Calgarians should be educated more clearly on how many units can be applied for under R-CG.", cluster: 4, x: -0.62, y: -0.20 },
    { id: 123, text: "I strongly support this rezoning and having Calgary do what some other cities have already done to increase the availability and diversity of housing. We should emulate Amsterdam, not Bakersfield.", cluster: 1, x: 0.82, y: 0.65 },
    { id: 124, text: "The thing I find most problematic about rezoning older neighborhoods is that it is not actually affordable. Who can afford $2M+ in Altadore?", cluster: 4, x: -0.42, y: 0.32 },
    { id: 125, text: "I'm supportive of the plan and would like to see Calgary do even more, especially around foreign ownership rules and short term rentals like AirBnB.", cluster: 1, x: 0.65, y: 0.60 },
    { id: 126, text: "Yes. There are missed opportunities for higher density along transit corridors. Not just R-CG — we need much higher densities near LRT stations.", cluster: 5, x: 0.72, y: 0.88 },
    { id: 127, text: "We have seen numerous times when government gets involved in housing that things get overly expensive. Leave housing to the developers, stop using taxpayer funds to advertise.", cluster: 4, x: -0.55, y: 0.08 },
    { id: 128, text: "Create the most density nearest to the core. Think of neighbourhoods where high density supports pubs and restaurants within walking distance — like London or Paris.", cluster: 7, x: 0.20, y: 0.55 },
    { id: 129, text: "I am against this rezoning program. It does not respect our existing communities, parking, way of living. The federal government needs to stop mass immigration!", cluster: 6, x: -0.72, y: 0.30 },
    { id: 130, text: "Rezoning is destroying every community to the point where everyone I talk to is talking about moving to a smaller community outside Calgary.", cluster: 2, x: -0.75, y: -0.72 },
    { id: 131, text: "I'm thrilled to hear that Calgary is taking housing seriously and using the policy means at its disposal to rezone for more housing. Well done, City of Calgary!", cluster: 1, x: 0.88, y: 0.58 },
    { id: 132, text: "I am not in favour of blanket rezoning. I doubt that infrastructure and parking are given enough consideration.", cluster: 3, x: -0.45, y: -0.75 },
    { id: 133, text: "Investors will gobble up land, create expensive condos and we'll have the same issue — developers better off financially while housing remains unaffordable.", cluster: 4, x: -0.50, y: 0.20 },
    { id: 134, text: "I understand the need for housing but transportation and road safety also need to be addressed. You cannot consider housing as simply rezoning.", cluster: 3, x: -0.35, y: -0.85 },
    { id: 135, text: "The City of Calgary should use outdated industrial and commercial areas for redevelopment before loading up current neighbourhoods with more density.", cluster: 7, x: -0.15, y: -0.18 },
    { id: 136, text: "We oppose blanket upzoning without community plans in place. It will erode housing affordability as it will increase the cost of land and lead to loss of mature trees.", cluster: 7, x: -0.32, y: -0.35 },
    { id: 137, text: "I am a young person hoping to afford a home in Calgary one day. This rezoning would help make that possible. Please support it!", cluster: 1, x: 0.84, y: 0.76 },
    { id: 138, text: "I'm a young person born in Calgary but have lived in denser cities internationally. Cities with more density are vibrant and a joy to live in.", cluster: 1, x: 0.80, y: 0.70 },
    { id: 139, text: "Rezoning is necessary to stop urban sprawl. But it should be paired with requirements for affordable units in new developments — not just market rate luxury builds.", cluster: 1, x: 0.55, y: 0.82 },
    { id: 140, text: "I am not in favor of city wide rezoning without this first being presented to property owners through a voting process at the next civic election.", cluster: 4, x: -0.58, y: -0.18 },
    { id: 141, text: "My major concern is that rezoning be applied equally throughout the city and not just in areas that may not have access to legal representation. Wealthy neighborhoods must also be included.", cluster: 4, x: -0.25, y: 0.05 },
    { id: 142, text: "I am in favour of rezoning to make RC-G the base district for homes in Calgary! This will help make housing more affordable and accessible for my family.", cluster: 1, x: 0.78, y: 0.62 },
    { id: 143, text: "Densification is important but it should only be in areas close to transit, shopping etc. Single family neighborhoods are not the right place for this.", cluster: 7, x: -0.28, y: -0.42 },
    { id: 144, text: "Good public transportation and provisions for active transportation will counter the biggest complaint against denser housing — parking.", cluster: 5, x: 0.60, y: 0.80 },
  ],
  summary: {
    total: 144,
    support_pct: 38,
    oppose_pct: 52,
    mixed_pct: 10,
    source_pages: 480,
    hearing_speakers: 736,
    hearing_date: "April 22 – May 14, 2024"
  }
};

const CLUSTER_COUNTS = clusterData.clusters.map(c => ({
  ...c,
  count: clusterData.comments.filter(cm => cm.cluster === c.id).length
}));

export default function App() {
  const [activeCluster, setActiveCluster] = useState(null);
  const [hoveredComment, setHoveredComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [view, setView] = useState("scatter"); // scatter | list
  const svgRef = useRef(null);

  const W = 680, H = 580;
  const PAD = 48;

  const toSVG = (v, dim) => {
    const range = dim === "x" ? W : H;
    const pad = PAD;
    return pad + ((v + 1) / 2) * (range - pad * 2);
  };

  const filteredComments = activeCluster
    ? clusterData.comments.filter(c => c.cluster === activeCluster)
    : clusterData.comments;

  const clusterMap = Object.fromEntries(clusterData.clusters.map(c => [c.id, c]));

  return (
    <div style={{
      background: "#0f0f13",
      minHeight: "100vh",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e2030",
        padding: "20px 32px 18px",
        background: "linear-gradient(180deg, #12121a 0%, #0f0f13 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#fff"
              }}>Opinion Cluster Map</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Inspired by Polis</div>
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
              Calgary Rezoning for Housing — Public Feedback
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "#64748b" }}>
              {clusterData.summary.total} comments from {clusterData.summary.source_pages}-page verbatim report &bull; Public hearing: {clusterData.summary.hearing_date} &bull; {clusterData.summary.hearing_speakers} speakers
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["scatter", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: view === v ? "#1e2235" : "transparent",
                borderColor: view === v ? "#3b82f6" : "#1e2030",
                color: view === v ? "#93c5fd" : "#475569",
                transition: "all 0.15s"
              }}>{v === "scatter" ? "⬡ Cluster Map" : "≡ Browse"}</button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "Oppose", pct: clusterData.summary.oppose_pct, color: "#ef4444" },
            { label: "Support", pct: clusterData.summary.support_pct, color: "#22c55e" },
            { label: "Mixed / Conditional", pct: clusterData.summary.mixed_pct, color: "#eab308" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>~{s.pct}%</span>
            </div>
          ))}
          <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#1e2030", overflow: "hidden", marginTop: -8 }}>
            <div style={{ display: "flex", height: "100%", width: "100%" }}>
              <div style={{ width: `${clusterData.summary.oppose_pct}%`, background: "linear-gradient(90deg,#ef4444,#f97316)", transition: "width 0.5s" }} />
              <div style={{ width: `${clusterData.summary.mixed_pct}%`, background: "#eab308", transition: "width 0.5s" }} />
              <div style={{ width: `${clusterData.summary.support_pct}%`, background: "linear-gradient(90deg,#22c55e,#3b82f6)", transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, height: "calc(100vh - 155px)", minHeight: 520 }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          borderRight: "1px solid #1e2030",
          padding: "16px 0",
          overflowY: "auto",
          background: "#0c0c10",
          flexShrink: 0
        }}>
          <div style={{ padding: "0 14px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#334155" }}>
            Opinion Clusters
          </div>
          <button
            onClick={() => setActiveCluster(null)}
            style={{
              width: "100%", textAlign: "left", padding: "8px 14px",
              background: !activeCluster ? "#1a1f35" : "transparent",
              border: "none", borderLeft: `3px solid ${!activeCluster ? "#3b82f6" : "transparent"}`,
              cursor: "pointer", color: !activeCluster ? "#93c5fd" : "#64748b",
              fontSize: 12, fontWeight: !activeCluster ? 600 : 400,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all 0.15s"
            }}
          >
            <span>All voices</span>
            <span style={{
              background: "#1e2235", padding: "1px 7px", borderRadius: 10,
              fontSize: 10, color: "#64748b"
            }}>{clusterData.comments.length}</span>
          </button>
          {CLUSTER_COUNTS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(activeCluster === c.id ? null : c.id)}
              style={{
                width: "100%", textAlign: "left", padding: "8px 14px",
                background: activeCluster === c.id ? "#1a1f35" : "transparent",
                border: "none", borderLeft: `3px solid ${activeCluster === c.id ? c.color : "transparent"}`,
                cursor: "pointer", color: activeCluster === c.id ? "#e2e8f0" : "#64748b",
                fontSize: 12, fontWeight: activeCluster === c.id ? 600 : 400,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 6, transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.shortName}</span>
              </div>
              <span style={{
                background: "#1e2235", padding: "1px 7px", borderRadius: 10,
                fontSize: 10, color: "#64748b", flexShrink: 0
              }}>{c.count}</span>
            </button>
          ))}

          {activeCluster && (
            <div style={{ margin: "12px 14px 0", padding: 10, background: "#12121a", borderRadius: 8, border: "1px solid #1e2030" }}>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                {clusterMap[activeCluster].description}
              </div>
            </div>
          )}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {view === "scatter" ? (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
                onClick={() => { setSelectedComment(null); }}
              >
                {/* Background grid */}
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#1a1f35" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f0f13" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Center gradient bg */}
                <ellipse cx={W/2} cy={H/2} rx={280} ry={240} fill="url(#bgGrad)" />

                {/* Axis lines */}
                <line x1={PAD} y1={H/2} x2={W-PAD} y2={H/2} stroke="#1e2030" strokeWidth="1" strokeDasharray="4,4" />
                <line x1={W/2} y1={PAD} x2={W/2} y2={H-PAD} stroke="#1e2030" strokeWidth="1" strokeDasharray="4,4" />

                {/* Axis labels */}
                <text x={PAD + 4} y={H/2 - 6} fill="#334155" fontSize="10" fontWeight="600">◀ OPPOSE</text>
                <text x={W - PAD - 4} y={H/2 - 6} fill="#334155" fontSize="10" fontWeight="600" textAnchor="end">SUPPORT ▶</text>
                <text x={W/2 + 6} y={PAD + 12} fill="#334155" fontSize="10" fontWeight="600">HOUSING / CLIMATE</text>
                <text x={W/2 + 6} y={H - PAD - 4} fill="#334155" fontSize="10" fontWeight="600">NEIGHBOURHOOD / INFRA</text>

                {/* Cluster convex hull blobs (approximate with ellipses) */}
                {clusterData.clusters.map(c => {
                  const pts = clusterData.comments.filter(cm => cm.cluster === c.id);
                  if (!pts.length) return null;
                  const xs = pts.map(p => toSVG(p.x, "x"));
                  const ys = pts.map(p => toSVG(p.y, "y"));
                  const cx = xs.reduce((a,b) => a+b,0)/xs.length;
                  const cy = ys.reduce((a,b) => a+b,0)/ys.length;
                  const rx = Math.max(...xs.map(x => Math.abs(x-cx))) + 18;
                  const ry = Math.max(...ys.map(y => Math.abs(y-cy))) + 18;
                  const isActive = activeCluster === c.id;
                  const isFiltered = activeCluster && !isActive;
                  return (
                    <ellipse
                      key={c.id}
                      cx={cx} cy={cy} rx={rx} ry={ry}
                      fill={c.color}
                      fillOpacity={isFiltered ? 0 : isActive ? 0.06 : 0.04}
                      stroke={c.color}
                      strokeOpacity={isFiltered ? 0 : isActive ? 0.3 : 0.12}
                      strokeWidth={isActive ? 1.5 : 1}
                      strokeDasharray={isActive ? "none" : "3,3"}
                      style={{ transition: "all 0.3s", pointerEvents: "none" }}
                    />
                  );
                })}

                {/* Cluster label */}
                {clusterData.clusters.map(c => {
                  const pts = clusterData.comments.filter(cm => cm.cluster === c.id);
                  if (!pts.length) return null;
                  const xs = pts.map(p => toSVG(p.x, "x"));
                  const ys = pts.map(p => toSVG(p.y, "y"));
                  const cx = xs.reduce((a,b) => a+b,0)/xs.length;
                  const minY = Math.min(...ys);
                  const isFiltered = activeCluster && activeCluster !== c.id;
                  return (
                    <text
                      key={c.id}
                      x={cx} y={minY - 10}
                      fill={c.color}
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      opacity={isFiltered ? 0.2 : 0.7}
                      letterSpacing="0.05em"
                      style={{ pointerEvents: "none", transition: "opacity 0.3s" }}
                    >
                      {c.shortName.toUpperCase()}
                    </text>
                  );
                })}

                {/* Comment dots */}
                {clusterData.comments.map(cm => {
                  const c = clusterMap[cm.cluster];
                  const sx = toSVG(cm.x, "x");
                  const sy = toSVG(cm.y, "y");
                  const isHovered = hoveredComment?.id === cm.id;
                  const isSelected = selectedComment?.id === cm.id;
                  const isFiltered = activeCluster && cm.cluster !== activeCluster;
                  const opacity = isFiltered ? 0.1 : isHovered || isSelected ? 1 : 0.7;

                  return (
                    <g key={cm.id}>
                      {(isHovered || isSelected) && (
                        <circle
                          cx={sx} cy={sy}
                          r={isSelected ? 9 : 7}
                          fill={c.color}
                          fillOpacity="0.15"
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                      <circle
                        cx={sx} cy={sy}
                        r={isSelected ? 5 : isHovered ? 4.5 : 3.5}
                        fill={c.color}
                        fillOpacity={opacity}
                        stroke={isSelected ? "#fff" : "none"}
                        strokeWidth={isSelected ? 1.5 : 0}
                        style={{
                          cursor: "pointer",
                          transition: "r 0.1s, fill-opacity 0.2s",
                          filter: isHovered ? "url(#glow)" : "none"
                        }}
                        onMouseEnter={() => setHoveredComment(cm)}
                        onMouseLeave={() => setHoveredComment(null)}
                        onClick={(e) => { e.stopPropagation(); setSelectedComment(cm); }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip on hover */}
              {hoveredComment && !selectedComment && (
                <div style={{
                  position: "absolute",
                  bottom: 16, left: "50%", transform: "translateX(-50%)",
                  background: "#1a1f2e",
                  border: `1px solid ${clusterMap[hoveredComment.cluster].color}40`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  maxWidth: 420,
                  width: "calc(100% - 48px)",
                  pointerEvents: "none",
                  zIndex: 10,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: clusterMap[hoveredComment.cluster].color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: clusterMap[hoveredComment.cluster].color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {clusterMap[hoveredComment.cluster].shortName}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{hoveredComment.text}</p>
                </div>
              )}

              {/* Selected comment panel */}
              {selectedComment && (
                <div style={{
                  position: "absolute",
                  bottom: 16, right: 16,
                  background: "#12121a",
                  border: `1px solid ${clusterMap[selectedComment.cluster].color}50`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  maxWidth: 340,
                  zIndex: 10,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.7)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: clusterMap[selectedComment.cluster].color }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: clusterMap[selectedComment.cluster].color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {clusterMap[selectedComment.cluster].name}
                      </span>
                    </div>
                    <button onClick={() => setSelectedComment(null)} style={{
                      background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0
                    }}>✕</button>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#e2e8f0", lineHeight: 1.65 }}>{selectedComment.text}</p>
                  <div style={{ marginTop: 10, fontSize: 11, color: "#334155" }}>
                    Position: x={selectedComment.x.toFixed(2)}, y={selectedComment.y.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* List view */
            <div style={{ overflowY: "auto", height: "100%", padding: "16px 24px" }}>
              {filteredComments.map(cm => (
                <div key={cm.id} style={{
                  background: "#12121a",
                  border: "1px solid #1e2030",
                  borderLeft: `3px solid ${clusterMap[cm.cluster].color}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 10,
                  transition: "border-color 0.15s",
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: clusterMap[cm.cluster].color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: clusterMap[cm.cluster].color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {clusterMap[cm.cluster].shortName}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.65 }}>{cm.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

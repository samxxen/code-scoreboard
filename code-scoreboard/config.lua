Config = Config or {}

Config.OpenKey   = 'HOME'
Config.Toggle    = false
Config.MaxPlayers = GetConvarInt('sv_maxclients', 100)

Config.color  = {204, 25, 51, 255}
Config.color1 = {155, 25, 51, 255}
Config.color2 = {165, 170, 180, 255}

Config.IllegalActions = {
    ["storerobbery"] = {
        minimumPolice = 1,
        busy  = false,
        id    = "storerobbery",
        label = "Store Robbery",
        icon  = "fa-solid fa-store",
        category = "robberies",
        order = 1
    },
    ["atm"] = {
        minimumPolice = 3,
        busy  = false,
        id    = "atm",
        label = "ATM Robbery",
        icon  = "fa-solid fa-credit-card",
        category = "robberies",
        order = 2
    },
    ["cashexchange"] = {
        minimumPolice = 4,
        busy  = false,
        id    = "cashexchange",
        label = "Cash Exchange",
        icon  = "fa-solid fa-money-bill-transfer",
        category = "robberies",
        order = 3
    },
    ["laundromat"] = {
        minimumPolice = 5,
        busy  = false,
        id    = "laundromat",
        label = "Laundromat",
        icon  = "fa-solid fa-shirt",
        category = "robberies",
        order = 4
    },
    ["jewellery"] = {
        minimumPolice = 8,
        busy  = false,
        id    = "jewellery",
        label = "Jewellery Store",
        icon  = "fa-solid fa-gem",
        category = "robberies",
        order = 5
    },
    ["Fleeca"] = {
        minimumPolice = 9,
        busy  = false,
        id    = "Fleeca",
        label = "Fleeca Bank",
        icon  = "fa-solid fa-building-columns",
        category = "robberies",
        order = 6
    },
    ["house"] = {
        minimumPolice = 5,
        busy  = false,
        id    = "house",
        label = "House Robbery",
        icon  = "fa-solid fa-house",
        category = "robberies",
        order = 7
    },
    ["blainecounty"] = {
        minimumPolice = 10,
        busy  = false,
        id    = "blainecounty",
        label = "Blaine County Robbery",
        icon  = "fa-solid fa-building-columns",
        category = "robberies",
        order = 8
    },
    ["kidnappingofficer"] = {
        minimumPolice = 4,
        busy  = false,
        id    = "kidnappingofficer",
        label = "kidnapping officer",
        icon  = "fa-solid fa-building-columns",
        category = "other",
        order = 8
    },
    ["kidnappingcitizen"] = {
        minimumPolice = 3,
        busy  = false,
        id    = "kidnappingcitizen",
        label = "kidnapping citizen",
        icon  = "fa-solid fa-building-columns",
        category = "other",
        order = 8
    },
}

Config.ShowIDforALL = true

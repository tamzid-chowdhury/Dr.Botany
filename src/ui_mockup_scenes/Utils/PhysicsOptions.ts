export const Physics = {
	groupNames: ["ground", "player", "enemies", "materials", "projectiles", "deposits"],
	collisions:
                            [
                                /*
                                    Init the next scene with physics collisions:
    
                                                ground  player  enemy   materials   equipment
                                    ground        No       --      --     --            --
                                    player        Yes      No      --     --            --
                                    enemy         Yes      No      No     --            No
                                    materials     Yes       No      No     No           No
                                    equipment     Yes       No      No     No           No
    
                                    Each layer becomes a number. In this case, 4 bits matter for each
    
                                    ground: self - 0001, collisions - 0110
                                    player: self - 0010, collisions - 1001
                                    enemy:  self - 0100, collisions - 0001
                                    coin:   self - 1000, collisions - 0010
                                */
                                // [0, 1, 1, 1, 1],
                                // [1, 0, 0, 0, 0],
                                // [1, 0, 0, 0, 0],
                                // [1, 0, 0, 0, 0],
                                // [1, 0, 0, 0, 0]

                                // TODO: figure out if commented out matrix is correct or not for materials/equipment
                                [0, 1, 1, 0, 0, 0],
                                [1, 0, 0, 0, 0, 0],
                                [1, 0, 1, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0]
                            ]
}
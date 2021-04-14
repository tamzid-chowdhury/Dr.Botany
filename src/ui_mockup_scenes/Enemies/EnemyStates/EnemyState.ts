import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyController from "../EnemyController";

export default abstract class EnemyState extends State {
    protected parent: EnemyController;
    protected owner: GameNode;

    constructor(parent: EnemyController, owner: GameNode){
      super(parent);
      this.owner = owner;
    }

    handleInput(event: GameEvent): void {}

	  update(deltaT: number): void {  }
}
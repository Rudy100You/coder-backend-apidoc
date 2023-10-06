import { resetKeySchema } from "../models/schema/resetKey.schema.js";
import { CommonMDBRepository } from "./commonMDB.repository.js";

export default class ResetKeyRepository extends CommonMDBRepository {
    constructor() {
    if(!ResetKeyRepository.instance){
        super("resetKeys", resetKeySchema);
        ResetKeyRepository.instance = this
    }
      return ResetKeyRepository.instance
    }
}


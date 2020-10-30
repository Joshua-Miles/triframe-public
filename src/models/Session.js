import { Resource } from '@triframe/core'
import { Model, session, stream } from '@triframe/scribe'

export class Session extends Resource {
 
  @session
  @stream
  static getSelectedPackageIds(session){
    return session.packageIds
  }

  @session
  static toggleSelectedPackageId(session, targetId){
    if(session.packageIds.includes(targetId)){
        session.packageIds = session.packageIds.filter( id => id != targetId)
    } else {
        session.packageIds = [ ...session.packageIds, targetId ]
    }
  }

}
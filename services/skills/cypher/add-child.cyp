MATCH (parent:Skill {name: 'web-dev'})
CREATE (parent)<-[:PART_OF]-(s:Skill {name: 'backend'})
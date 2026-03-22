MATCH (parent:Skill {name: 'web-dev'})<-[r:PART_OF]-(children:Skill)
RETURN parent, r, children
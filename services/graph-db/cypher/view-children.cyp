MATCH
  (parent:Skill {id: 'aedae857-6f43-46ca-bc09-49d349d49c0e'})<-[r:PART_OF]-
  (children:Skill)
RETURN parent, r, children
MATCH (prerequisite:Skill)
WHERE
  prerequisite.parentId = $parentId OR
  (prerequisite.parentId IS NULL AND $parentId IS NULL)
OPTIONAL MATCH (prerequisite)<-[r:PREREQUISITE_OF]-(target:Skill)
WHERE
  target.parentId = prerequisite.parentId OR
  (target.parentId IS NULL AND prerequisite.parentId IS NULL)
RETURN prerequisite, r, target
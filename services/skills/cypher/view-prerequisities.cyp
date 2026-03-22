MATCH (s1:Skill)-[r:PREREQUISITE_OF]->(s2:Skill)
RETURN s1, r, s2
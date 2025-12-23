# Structure

## domain/

This folder holds entities, business invariants, exceptions and other domain rules.

### paths/

Domain rules for paths

`entities/` - domain entity classes related to paths

`enums/` - domain enums

`exceptions/` domain exceptions

### sections/

Domain rules for sections

`entities/` - domain entity classes related to sections

`enums/` - domain enums

`exceptions/` domain exceptions

### units/

Domain rules for units

`entities/` - domain entity classes related to units

`enums/` - domain enums

`exceptions/` domain exceptions

### items/

Domain rules for items

`enums/` - domain enums

### exercises/

Domain rules for exercises

`enums/` - domain enums

## app/

This folder holds application logic.

### paths/

Application logic for paths.

`commands` - classes representing data needed to create, read, update or delete paths

`interfaces` - abstract interfaces of services and repositories to be implemented by concrete classes in infrastructure layer

`use-cases` - classes containing application logic
 
### sections/

Application logic for sections.

`commands` - classes representing data needed to create, read, update or delete sections

`interfaces` - abstract interfaces of services and repositories to be implemented by concrete classes in infrastructure layer

`use-cases` - classes containing application logic

### units/

Application logic for units.

`commands` - classes representing data needed to create, read, update or delete units

`interfaces` - abstract interfaces of services and repositories to be implemented by concrete classes in infrastructure layer

`use-cases` - classes containing application logic

## infra/

This folder holds framework and infrastructure specific code, like controllers, repositories or external services wrappers.

### paths/

Infrastructure logic for paths

### sections/

Infrastructure logic for sections

### units/

Infrastructure logic for units
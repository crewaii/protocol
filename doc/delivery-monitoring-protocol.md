# DMP / Delivery Monitoring Protocol

## TERMS
- `FRAGMENT`: the result of data partitioning.
- `TRANSPORT`: mechanism of fragmented data interchange that guarantees in-order delivering (examples: [TCP](https://tools.ietf.org/html/rfc793)).

## PROBLEM
  There are [`TRANSPORT`](#terms)s that can fall and in this case, does not provide information about [`FRAGMENT`](#terms)s were delivered. This creates a problem after returning the ability to transfer fragments: which [`FRAGMENT`](#terms)s should be resended?

## INTRODUCTION
  [`DMP`](#dmp--delivery-monitoring-protocol) has to be used with the [`TRANSPORT`](#terms) for tracking [`FRAGMENT`](#terms) delivery and, in case of the [`TRANSPORT`](#terms) failure, detecting undelivered [`FRAGMENT`](#terms)s. It solves [`PROBLEM`](#problem), and takes care of the efficient use of memory and the time required for recovery. The protocol is symmetric for the sending and receiving side.

## PROTOCOL DESCRIPTION
### SPECIAL FRAGMENTS
- `ACK`: does not contain any information, has to be sent in response to [`ACK`](#special-fragments) from the other side.
- `SYN`: contains [`REMOTE_STORAGE_PTR`](#data-structures) and [`COUNTER`](#data-structures), and has to be sent primarily after [`TRANSPORT`](#terms) restoration from both sides.
  
### DATA STRUCTURES
- `STORAGE[0]`, `STORAGE[1]`: two ordered "storages" of sent [`FRAGMENT`](#terms)s. (The "storage" is only conditional. The main thing is that you should have access to the already sent [`FRAGMENT`](#terms)s, divided into two parts as the protocol requires.)
- `LOCAL_STORAGE_PTR`: a boolean pointer to which "storage" the [`FRAGMENT`](#terms)s should be written.
- `REMOTE_STORAGE_PTR`: a boolean pointer, latest verified local knowledge of the status of a remote [`LOCAL_STORAGE_PTR`](#data-structures).
- `COUNTER`: an unsigned integer counter of the received data [`FRAGMENT`](#terms)s.

### PROTOCOL STAGES
#### PREPARATION
  Before the start of the transferring [`FRAGMENT`](#terms)s both sides have to initialize the necessary data structures with default values (empty storages([`STORAGE[0]`](#data-structures), [`STORAGE[1]`](#data-structures)), [`LOCAL_STORAGE_PTR`](#data-structures)`= 0`, [`REMOTE_STORAGE_PTR`](#data-structures)`= 0`, [`COUNTER`](#data-structures)`= 0`).

#### [NORMAL MODE](dmp-normal-mode.md)
  When side sends [`FRAGMENT`](#terms), it has to write a [`FRAGMENT`](#terms) to the [`STORAGE[LOCAL_STORAGE_PTR]`](#data-structures). When receiver side gets [`FRAGMENT`](#terms), it has to increment [`COUNTER`](#data-structures). When anyone gets [`ACK`](#special-fragments) it has to set [`COUNTER`](#data-structures)`= 0` and at the same time negate the [`REMOTE_STORAGE_PTR`](#data-structures), and then send the [`ACK`](#special-fragments) back and at the same time negate the [`LOCAL_STORAGE_PTR`](#data-structures) and clear [`STORAGE[LOCAL_STORAGE_PTR]`](#data-structures).

| Transition | State changes |
|:-------------:|:----------------:|
| send [`FRAGMENT`](#terms) | add a [`FRAGMENT`](#terms) to the [`STORAGE[LOCAL_STORAGE_PTR]`](#data-structures) |
| recieved [`FRAGMENT`](#terms) | [`COUNTER`](#data-structures) += 1 |
| send [`ACK`](#special-fragments) | [`LOCAL_STORAGE_PTR`](#data-structures) ^= 1 and then clear [`STORAGE[LOCAL_STORAGE_PTR]`](#data-structures) |
| recieved [`ACK`](#special-fragments) | [`COUNTER`](#data-structures) = 0, [`REMOTE_STORAGE_PTR`](#data-structures) ^= 1 |

#### [RESTORE MODE](dmp-restore-mode.md)
  Suppose that [`TRANSPORT`](#terms) has [failed](dmp-transport-failed.md).
  
  After its restoration both sides have to sent [`SYN`](#special-fragments). If [`REMOTE_STORAGE_PTR`](#data-structures)<sub>remote</sub> equals [`LOCAL_STORAGE_PTR`](#data-structures)<sub>local</sub>, [`FRAGMENT`](#terms)s from [`STORAGE[LOCAL_STORAGE_PTR]`](#data-structures) starting from [`COUNTER`](#data-structures)<sub>remote</sub> were not delivered. Otherwise undelivered [`FRAGMENT`](#terms)s are those ones from [`STORAGE[!LOCAL_STORAGE_PTR]]`](#data-structures) starting from [`COUNTER`](#data-structures)<sub>remote</sub> and all [`FRAGMENT`](#terms)s from [`STORAGE[LOCAL_STORAGE_PTR]]`](#data-structures).
  
  To restore sending [`FRAGMENT`](#terms)s, each side has to resend all of the undelivered [`FRAGMENT`](#terms)s. Side can start sending new [`FRAGMENT`](#terms)s and as soon as re-send all of the undelivered [`FRAGMENT`](#terms)s from your side.

### CODE EXAMPLE
  ![dmp-code-example](https://user-images.githubusercontent.com/31734731/60059325-c6065080-96f4-11e9-8811-19d7abd9a8e7.png)

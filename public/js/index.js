$(function() {

    // handles data storage
    var data = {
        init: function() {
            this.grid = [];
            this.instruction = "";
        },
        grid: [],
        instruction: "",
        getGrid: function() {
            return this.grid;
        },
    };

    // robot functionalities
    var controller = {
        buildGrid: function(coord) {

            //upper right coordinate
            URCoord = coord.split(" ");
            var gridStart = { x: 0, y: 0 };
            var gridEnd = { x: URCoord[1], y: URCoord[0] };

            var gridReady = [{}];
            _.forEach((_.range(gridStart.y, parseInt(gridEnd.y))), function(yCord, i) {
                gridReady[yCord] = [];
                _.forEach((_.range(gridStart.x, parseInt(gridEnd.x))), function(xCord, j) {
                    gridReady[yCord][xCord] = ({ y: yCord, x: xCord });
                });
            });

            gridReady.sort();
            data.grid = gridReady;
        },
        gridView: function() {
            var html = [];
            var gridRef = {};

            _.forEach(_.reverse(_.keys(data.grid)), function(y, i) {
                var row = [];
                _.forEach(_.reverse(_.keys(data.grid[y])), function(w, j) {
                    //create grid reference
                    console.log();
                    var uid = y.toString() + '-' + w.toString();
                    row.push('<div class="grid" id="' + uid + '"  data-x="' + w + '" data-y="' + y + '">' +
                        '<div class="col-xs-12 message">' + uid + '</div>' +
                        '<div class="col-xs-12 robot">' + '' + '</div>' +
                        '</div>');
                });

                html = html.concat(row);

            });

            return html.join("");
        },
        parseInst: function() {
            var inst = data.instruction.split("\n");
            data.maxGridSize = inst[0];
            inst.shift();
            data.inst = _.chunk(inst, 3).map(function(y, i) {
                var position = y[0].split(" ");
                return {
                    position: {
                        "x": position[0],
                        "y": position[1],
                        "direction": position[2],
                    },
                    instruction: y[1]
                }
            });

            this.ProcessingInstruction();
        },

        ProcessingInstruction: function() {
            _.forEach(data.inst, function(robot, i) {
                var uid = robot.position.y.toString() + '-' + robot.position.x.toString();
                //

                // mark position
                $("#" + uid + " .robot").html("<img src='public/img/robot.png'/>");

                var instruction = robot.instruction.split("");
                var direction = robot.position.direction;
                var instructionCount = 0;
                while (instructionCount < instruction.length) {

                    var lastPosition = direction;
                    robot.position.direction = controller.getFinalPosition(direction, instruction[instructionCount]);
                    console.log(lastPosition)

                    // if instruction is to move forward in one direction
                    if (robot.position.direction == "F") {
                        switch (lastPosition) {
                            case "N":
                                robot.position.y++;
                                console.log(robot.position.y, robot.position.y++);
                                break;
                            case "S":
                                robot.position.y--;
                                console.log(robot.position.y, robot.position.y++);

                                break;
                            case "E":
                                robot.position.x++;
                                console.log(robot.position.x++);
                                break;
                            case "W":
                                robot.position.x--;
                                break;
                            default:
                                break;
                        }
                    }
                    direction = robot.position.direction;

                    //update robot positions
                    console.log(data.inst[i]);
                    console.log(robot);
                    data.inst[i] = robot;
                    console.log(data.inst[i]);

                    instructionCount++
                };

            });
        },
        getFinalPosition: function(currentDirection, instruction) {
            return this.lookupDirection(currentDirection, instruction);
        },
        lookupDirection: function(position, instruction) {

            switch (position) {
                case "E":
                    switch (instruction) {
                        case "R":
                            return "S";
                            break;
                        case "L":
                            return "N";
                            break;

                        default:
                            break;
                    }
                    break;

                case "W":
                    switch (instruction) {
                        case "R":
                            return "N";
                            break;
                        case "L":
                            return "S";
                            break;

                        default:
                            break;
                    }
                    break;

                case "N":
                    switch (instruction) {
                        case "R":
                            return "E";
                            break;
                        case "L":
                            return "W";
                            break;

                        default:
                            break;
                    }
                    break;

                case "S":
                    switch (instruction) {
                        case "R":
                            return "E";
                            break;
                        case "L":
                            return "W";
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
            return instruction;

        }

    };

    //render view
    var view = {
        init: function() {
            this.DisplayView = $("#screen");
        },
        render: function(entity) {
            var content = ""
            switch (entity) {
                case "grid":
                    content = controller.gridView()
                    break;

                default:
                    break;
            }
            if (content != "") {
                this.DisplayView.html('<div class="board">' + content + '</div>');
            }
        },
        event: function() {

            $('#command').submit(function(e) {
                e.preventDefault();
                data.instruction = $("#" + e.target.id).find("textarea").val();
                controller.parseInst();
            })
        }
    };

    view.init();
    data.init();
    controller.buildGrid("6 4");
    view.render("grid");
    view.event()

});
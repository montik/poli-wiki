Function.prototype.bind = function(context){
  var fn = this, 
      ap, concat, args,
      isPartial = arguments.length > 1;
  // Strategy 1: just bind, not a partialApply
  if(!isPartial) {
    return function() {
        if(arguments.length !== 0) {
          return fn.apply(context, arguments);
        } else {
          return fn.call(context); // faster in Firefox.
        }
      };
    } else {
    // Strategy 2: partialApply
    ap = Array.prototype,
    args = ap.slice.call(arguments, 1);
    concat = ap.concat;
    return function() {
      return fn.apply(context, 
        arguments.length === 0 ? args : 
        concat.apply(args, arguments));
    };
  }
};
